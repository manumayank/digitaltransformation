'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { businessProfileAPI, BusinessProfile } from '@/lib/api/business-profile.api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function NewAssessmentPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await businessProfileAPI.getAll();
      setProfiles(data);

      // Auto-select if only one profile
      if (data.length === 1) {
        setSelectedProfileId(data[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to load business profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    if (!selectedProfileId) {
      toast.error('Please select a business profile');
      return;
    }

    try {
      setIsLoading(true);

      // Create assessment via API
      const { assessmentAPI } = await import('@/lib/api/assessment.api');
      const assessment = await assessmentAPI.create({
        businessProfileId: selectedProfileId,
      });

      toast.success('Assessment created successfully!');

      // Navigate to assessment page
      router.push(`/assessment/${assessment.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create assessment');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (profiles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No business profiles found
          </h3>
          <p className="mt-1 text-gray-500">
            You need to create a business profile before starting an assessment.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/business-profile/create')}>
              Create Business Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white shadow rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Start New Assessment
          </h1>
          <p className="mt-2 text-gray-600">
            Select a business profile to begin your digital readiness assessment.
          </p>
        </div>

        {/* Profile Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Business Profile
          </label>
          <div className="grid grid-cols-1 gap-4">
            {profiles.map((profile) => (
              <label
                key={profile.id}
                className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedProfileId === profile.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="profile"
                  value={profile.id}
                  checked={selectedProfileId === profile.id}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.businessName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {profile.industry} • {profile.businessSize}
                      </p>
                      {profile._count && (
                        <p className="text-xs text-gray-400 mt-1">
                          {profile._count.assessments} previous assessment
                          {profile._count.assessments !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <svg
              className="h-5 w-5 text-blue-400 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">
                About the Assessment
              </h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>10 modules covering all aspects of digital readiness</li>
                  <li>Questions tailored to your business profile</li>
                  <li>Save and resume at any time</li>
                  <li>Approximately 30-45 minutes to complete</li>
                  <li>Receive detailed recommendations upon completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={!selectedProfileId}
          >
            Start Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
