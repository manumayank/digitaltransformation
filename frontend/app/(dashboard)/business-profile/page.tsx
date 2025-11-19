'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  businessProfileAPI,
  BusinessProfile,
  getIndustryLabel,
  getBusinessSizeLabel,
  getGrowthStageLabel,
} from '@/lib/api/business-profile.api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function BusinessProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await businessProfileAPI.getAll();
      setProfiles(data);
    } catch (error: any) {
      toast.error('Failed to load business profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await businessProfileAPI.delete(id);
      toast.success('Business profile deleted successfully');
      setProfiles(profiles.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to delete business profile'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Profiles
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your business profiles and track assessments.
            </p>
          </div>
          <Link href="/business-profile/create">
            <Button>+ Create New Profile</Button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {profiles.length === 0 && (
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
            No business profiles yet
          </h3>
          <p className="mt-1 text-gray-500">
            Get started by creating your first business profile.
          </p>
          <div className="mt-6">
            <Link href="/business-profile/create">
              <Button>Create Business Profile</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Profiles Grid */}
      {profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate flex-1">
                    {profile.businessName}
                  </h3>
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                    {getGrowthStageLabel(profile.growthStage)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {getIndustryLabel(profile.industry)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {getBusinessSizeLabel(profile.businessSize)}
                  </div>
                  {profile.numberOfEmployees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {profile.numberOfEmployees} employees
                    </div>
                  )}
                  {profile._count && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {profile._count.assessments} assessment
                      {profile._count.assessments !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="border-t pt-4 mb-4">
                  <p className="text-xs text-gray-500">
                    Created {formatDate(profile.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/business-profile/${profile.id}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link
                    href={`/business-profile/edit/${profile.id}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(profile.id, profile.businessName)}
                    isLoading={deletingId === profile.id}
                    disabled={deletingId !== null}
                    className="px-3"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
