'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  businessProfileAPI,
  Industry,
  BusinessSize,
  GrowthStage,
  ExitTimeline,
  UpdateBusinessProfileInput,
} from '@/lib/api/business-profile.api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormField from '@/components/ui/FormField';
import Loading from '@/components/ui/Loading';

// Validation schema
const businessProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  industry: z.nativeEnum(Industry),
  businessSize: z.nativeEnum(BusinessSize),
  growthStage: z.nativeEnum(GrowthStage),
  annualRevenue: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
  numberOfEmployees: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  numberOfLocations: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  yearEstablished: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  exitTimeline: z.string().optional() as z.ZodType<ExitTimeline | '' | undefined>,
  description: z.string().max(2000).optional(),
  website: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export default function EditBusinessProfilePage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
  });

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await businessProfileAPI.getById(profileId);
        reset({
          businessName: profile.businessName,
          industry: profile.industry,
          businessSize: profile.businessSize,
          growthStage: profile.growthStage,
          annualRevenue: profile.annualRevenue?.toString() || '',
          numberOfEmployees: profile.numberOfEmployees?.toString() || '',
          numberOfLocations: profile.numberOfLocations?.toString() || '',
          yearEstablished: profile.yearEstablished?.toString() || '',
          exitTimeline: (profile.exitTimeline as ExitTimeline) || '',
          description: profile.description || '',
          website: profile.website || '',
        } as any);
      } catch (error: any) {
        toast.error('Failed to load business profile');
        router.push('/business-profile');
      } finally {
        setIsFetching(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId, reset, router]);

  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      setIsLoading(true);

      // Transform data for API
      const input: UpdateBusinessProfileInput = {
        businessName: data.businessName,
        industry: data.industry,
        businessSize: data.businessSize,
        growthStage: data.growthStage,
        annualRevenue: data.annualRevenue || null,
        numberOfEmployees: data.numberOfEmployees || null,
        numberOfLocations: data.numberOfLocations || null,
        yearEstablished: data.yearEstablished || null,
        exitTimeline: (data.exitTimeline as ExitTimeline) || null,
        description: data.description || null,
        website: data.website || null,
      };

      await businessProfileAPI.update(profileId, input);
      toast.success('Business profile updated successfully!');
      router.push(`/business-profile/${profileId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update business profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Business Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Update your business information to keep your assessments accurate.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="Business Name"
              error={errors.businessName?.message}
              required
            >
              <Input
                {...register('businessName')}
                placeholder="e.g., Acme Corp"
                error={!!errors.businessName}
              />
            </FormField>

            <FormField label="Industry" error={errors.industry?.message} required>
              <select
                {...register('industry')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select an industry</option>
                <option value={Industry.TECHNOLOGY}>Technology</option>
                <option value={Industry.RETAIL}>Retail</option>
                <option value={Industry.MANUFACTURING}>Manufacturing</option>
                <option value={Industry.HEALTHCARE}>Healthcare</option>
                <option value={Industry.FINANCE}>Finance</option>
                <option value={Industry.REAL_ESTATE}>Real Estate</option>
                <option value={Industry.HOSPITALITY}>Hospitality</option>
                <option value={Industry.EDUCATION}>Education</option>
                <option value={Industry.CONSTRUCTION}>Construction</option>
                <option value={Industry.PROFESSIONAL_SERVICES}>
                  Professional Services
                </option>
                <option value={Industry.FOOD_AND_BEVERAGE}>
                  Food & Beverage
                </option>
                <option value={Industry.TRANSPORTATION}>Transportation</option>
                <option value={Industry.AGRICULTURE}>Agriculture</option>
                <option value={Industry.ENTERTAINMENT}>Entertainment</option>
                <option value={Industry.OTHER}>Other</option>
              </select>
            </FormField>

            <FormField
              label="Business Size"
              error={errors.businessSize?.message}
              required
            >
              <select
                {...register('businessSize')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select business size</option>
                <option value={BusinessSize.MICRO}>
                  Micro (1-10 employees)
                </option>
                <option value={BusinessSize.SMALL}>
                  Small (11-50 employees)
                </option>
                <option value={BusinessSize.MEDIUM}>
                  Medium (51-250 employees)
                </option>
                <option value={BusinessSize.LARGE}>
                  Large (251+ employees)
                </option>
              </select>
            </FormField>

            <FormField
              label="Growth Stage"
              error={errors.growthStage?.message}
              required
            >
              <select
                {...register('growthStage')}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select growth stage</option>
                <option value={GrowthStage.STARTUP}>Startup</option>
                <option value={GrowthStage.EARLY_GROWTH}>Early Growth</option>
                <option value={GrowthStage.ESTABLISHED}>Established</option>
                <option value={GrowthStage.MATURE}>Mature</option>
                <option value={GrowthStage.EXIT_READY}>Exit Ready</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Business Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Annual Revenue (USD)"
              error={errors.annualRevenue?.message}
            >
              <Input
                type="number"
                step="0.01"
                {...register('annualRevenue')}
                placeholder="e.g., 1000000"
                error={!!errors.annualRevenue}
              />
            </FormField>

            <FormField
              label="Number of Employees"
              error={errors.numberOfEmployees?.message}
            >
              <Input
                type="number"
                {...register('numberOfEmployees')}
                placeholder="e.g., 25"
                error={!!errors.numberOfEmployees}
              />
            </FormField>

            <FormField
              label="Number of Locations"
              error={errors.numberOfLocations?.message}
            >
              <Input
                type="number"
                {...register('numberOfLocations')}
                placeholder="e.g., 3"
                error={!!errors.numberOfLocations}
              />
            </FormField>

            <FormField
              label="Year Established"
              error={errors.yearEstablished?.message}
            >
              <Input
                type="number"
                {...register('yearEstablished')}
                placeholder="e.g., 2015"
                min="1800"
                max={new Date().getFullYear()}
                error={!!errors.yearEstablished}
              />
            </FormField>
          </div>
        </div>

        {/* Exit Planning */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Exit Planning
          </h2>
          <FormField
            label="Exit Timeline"
            error={errors.exitTimeline?.message}
          >
            <select
              {...register('exitTimeline')}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select exit timeline (optional)</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
              <option value="Not planning to exit">Not planning to exit</option>
            </select>
          </FormField>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>
          <div className="space-y-6">
            <FormField label="Website" error={errors.website?.message}>
              <Input
                type="url"
                {...register('website')}
                placeholder="https://www.example.com"
                error={!!errors.website}
              />
            </FormField>

            <FormField
              label="Business Description"
              error={errors.description?.message}
            >
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Tell us about your business, what you do, and your goals..."
                maxLength={2000}
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum 2000 characters
              </p>
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/business-profile/${profileId}`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Business Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
