'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  businessProfileAPI,
  BusinessProfileWithAssessments,
  BusinessProfileStats,
  getIndustryLabel,
  getBusinessSizeLabel,
  getGrowthStageLabel,
} from '@/lib/api/business-profile.api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function BusinessProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  const [profile, setProfile] = useState<BusinessProfileWithAssessments | null>(
    null
  );
  const [stats, setStats] = useState<BusinessProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      const data = await businessProfileAPI.getById(profileId);
      setProfile(data);
    } catch (error: any) {
      toast.error('Failed to load business profile');
      router.push('/business-profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await businessProfileAPI.getStats(profileId);
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${profile?.businessName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await businessProfileAPI.delete(profileId);
      toast.success('Business profile deleted successfully');
      router.push('/business-profile');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to delete business profile'
      );
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !profile) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.businessName}
            </h1>
            <p className="mt-2 text-gray-600">
              {getIndustryLabel(profile.industry)} •{' '}
              {getGrowthStageLabel(profile.growthStage)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/business-profile/edit/${profile.id}`}>
              <Button variant="secondary">Edit Profile</Button>
            </Link>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Business Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getIndustryLabel(profile.industry)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Business Size
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getBusinessSizeLabel(profile.businessSize)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Growth Stage
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getGrowthStageLabel(profile.growthStage)}
                </dd>
              </div>
              {profile.annualRevenue && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Annual Revenue
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(profile.annualRevenue)}
                  </dd>
                </div>
              )}
              {profile.numberOfEmployees && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Employees
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.numberOfEmployees}
                  </dd>
                </div>
              )}
              {profile.numberOfLocations && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Locations
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.numberOfLocations}
                  </dd>
                </div>
              )}
              {profile.yearEstablished && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Year Established
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.yearEstablished}
                  </dd>
                </div>
              )}
              {profile.exitTimeline && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Exit Timeline
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.exitTimeline}
                  </dd>
                </div>
              )}
              {profile.website && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-primary-600 hover:text-primary-700">
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Description */}
          {profile.description && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {profile.description}
              </p>
            </div>
          )}

          {/* Recent Assessments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Assessments
              </h2>
              <Link href={`/assessments/new?profileId=${profile.id}`}>
                <Button size="sm">+ New Assessment</Button>
              </Link>
            </div>
            {profile.assessments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No assessments yet. Create your first assessment to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {profile.assessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/assessments/${assessment.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            Assessment {assessment.id.slice(0, 8)}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              assessment.status === 'COMPLETED'
                                ? 'bg-success-100 text-success-800'
                                : assessment.status === 'IN_PROGRESS'
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {assessment.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(assessment.createdAt)}
                        </p>
                      </div>
                      {assessment.overallScore !== null && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            {Math.round(assessment.overallScore)}
                          </p>
                          <p className="text-xs text-gray-500">Overall Score</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          {stats && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAssessments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-success-600">
                    {stats.completedAssessments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {stats.inProgressAssessments}
                  </p>
                </div>
              </div>

              {stats.completedAssessments > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Average Scores
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overall</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats.averageScores.overall}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Digital</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats.averageScores.digital}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Legacy</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats.averageScores.legacy}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Metadata
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Profile ID
                </dt>
                <dd className="mt-1 text-xs text-gray-900 font-mono">
                  {profile.id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(profile.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(profile.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href={`/assessments/new?profileId=${profile.id}`}
                className="block"
              >
                <Button variant="secondary" className="w-full">
                  Start New Assessment
                </Button>
              </Link>
              <Link href="/business-profile" className="block">
                <Button variant="secondary" className="w-full">
                  View All Profiles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
