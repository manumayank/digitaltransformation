import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { cache } from '../config/redis';
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: any;
  tokens: AuthTokens;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly JWT_REFRESH_EXPIRES_IN: string;
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    this.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    if (!this.JWT_SECRET || !this.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets are not configured');
    }
  }

  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: 'USER',
        isActive: true,
        emailVerified: false,
      },
    });

    logger.info(`New user registered: ${user.email}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info(`User logged in: ${user.email}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as TokenPayload;

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        // Delete expired token
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new UnauthorizedError('Refresh token expired');
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    // Clear any cached user data
    await cache.del(`user:${userId}`);

    logger.info(`User logged out: ${userId}`);
  }

  /**
   * Hash password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // Generate access token
    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);

    // Generate refresh token
    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN as string,
    } as jwt.SignOptions);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Verify current password
    const isPasswordValid = await this.verifyPassword(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    logger.info(`Password changed for user: ${user.email}`);
  }

  /**
   * Clean up expired refresh tokens (should be run periodically)
   */
  async cleanupExpiredTokens(): Promise<void> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    logger.info(`Cleaned up ${result.count} expired refresh tokens`);
  }
}

export const authService = new AuthService();
