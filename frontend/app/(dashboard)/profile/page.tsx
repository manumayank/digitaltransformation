'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/stores/auth.store';
import { userAPI } from '@/lib/api/user.api';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name cannot be empty').optional().or(z.literal('')),
  lastName: z.string().min(1, 'Last name cannot be empty').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const updatedUser = await userAPI.updateProfile(data);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email (Read-only) */}
            <div>
              <label className="form-label">Email</label>
              <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-2">
                <span className="text-sm text-gray-900">{user.email}</span>
                {user.emailVerified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Not Verified</span>
                )}
              </div>
              <p className="form-help">Email cannot be changed</p>
            </div>

            {/* First Name */}
            <FormField
              label="First Name"
              type="text"
              placeholder="John"
              error={errors.firstName?.message}
              disabled={!isEditing}
              {...register('firstName')}
            />

            {/* Last Name */}
            <FormField
              label="Last Name"
              type="text"
              placeholder="Doe"
              error={errors.lastName?.message}
              disabled={!isEditing}
              {...register('lastName')}
            />

            {/* Phone */}
            <FormField
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              error={errors.phone?.message}
              disabled={!isEditing}
              helperText="Optional: Include country code for better compatibility"
              {...register('phone')}
            />

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Account Information Card */}
        <div className="card">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Account Information</h2>

          <div className="space-y-4">
            <div>
              <label className="form-label">Account Status</label>
              <div className="flex items-center gap-2">
                {user.isActive ? (
                  <span className="badge badge-success">Active</span>
                ) : (
                  <span className="badge badge-danger">Inactive</span>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Role</label>
              <div>
                <span className="badge badge-primary capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>

            <div>
              <label className="form-label">Member Since</label>
              <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
            </div>

            <div>
              <label className="form-label">Last Updated</label>
              <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="card">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Security</h2>

          <div className="space-y-4">
            <div>
              <label className="form-label">Password</label>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">••••••••</p>
                <Button variant="outline" onClick={() => router.push('/profile/change-password')}>
                  Change Password
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
              <h3 className="mb-2 font-medium text-warning-800">Security Tips</h3>
              <ul className="space-y-1 text-sm text-warning-700">
                <li>• Use a strong, unique password</li>
                <li>• Change your password regularly</li>
                <li>• Never share your password with anyone</li>
                <li>• Enable two-factor authentication (coming soon)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="card border-danger-200">
          <h2 className="mb-6 text-xl font-semibold text-danger-600">Danger Zone</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">Delete Account</h3>
              <p className="mb-4 text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="danger" onClick={() => router.push('/profile/delete-account')}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
