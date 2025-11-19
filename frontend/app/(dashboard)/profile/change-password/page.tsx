'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { userAPI } from '@/lib/api/user.api';
import { useAuthStore } from '@/lib/stores/auth.store';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 8) return { label: 'Weak', color: 'bg-danger-500', width: '33%' };
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return { label: 'Fair', color: 'bg-warning-500', width: '66%' };
    return { label: 'Strong', color: 'bg-success-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);

      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Password changed successfully! Please login again.');

      // Log out user after password change
      setTimeout(async () => {
        await logout();
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/profile" className="mb-4 inline-flex items-center text-sm text-primary-600 hover:text-primary-700">
          ← Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-2 text-gray-600">Update your password to keep your account secure</p>
      </div>

      {/* Change Password Card */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div>
            <FormField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter your current password"
              error={errors.currentPassword?.message}
              required
              {...register('currentPassword')}
            />

            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="showCurrentPassword"
                checked={showCurrentPassword}
                onChange={(e) => setShowCurrentPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="showCurrentPassword" className="ml-2 text-sm text-gray-600">
                Show current password
              </label>
            </div>
          </div>

          {/* New Password */}
          <div>
            <FormField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              error={errors.newPassword?.message}
              required
              {...register('newPassword')}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-gray-600">Password strength</span>
                  <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}

            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="showNewPassword"
                checked={showNewPassword}
                onChange={(e) => setShowNewPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="showNewPassword" className="ml-2 text-sm text-gray-600">
                Show new password
              </label>
            </div>
          </div>

          {/* Confirm New Password */}
          <FormField
            label="Confirm New Password"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            required
            {...register('confirmPassword')}
          />

          {/* Password Requirements */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Password requirements:</p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Contains uppercase and lowercase letters
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Contains at least one number
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 flex-shrink-0 text-warning-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning-800">Important</h3>
                <p className="mt-1 text-sm text-warning-700">
                  After changing your password, you will be logged out and need to sign in again with your new password.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={isLoading}>
              Change Password
            </Button>
            <Link href="/profile">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 font-medium text-gray-900">Password Security Tips</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Use a unique password for this account</li>
          <li>• Avoid using personal information in your password</li>
          <li>• Consider using a password manager</li>
          <li>• Change your password if you suspect it has been compromised</li>
        </ul>
      </div>
    </div>
  );
}
