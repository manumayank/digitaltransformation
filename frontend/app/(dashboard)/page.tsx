'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  assessmentAPI,
  Assessment,
  AssessmentStatus,
  getAssessmentStatusLabel,
  getAssessmentStatusColor,
} from '@/lib/api/assessment.api';
import toast from 'react-hot-toast';

type StatusFilter = 'ALL' | AssessmentStatus;

export default function DashboardPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    filterAndSortAssessments();
  }, [assessments, statusFilter, sortBy]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const data = await assessmentAPI.getAll();
      setAssessments(data);
    } catch (error: any) {
      console.error('Failed to load assessments:', error);
      toast.error(error.response?.data?.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAssessments = () => {
    let filtered = [...assessments];

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === 'date') {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => {
        const scoreA = a.overallScore ?? -1;
        const scoreB = b.overallScore ?? -1;
        return scoreB - scoreA;
      });
    }

    setFilteredAssessments(filtered);
  };

  const handleDelete = async (id: string, businessName: string) => {
    if (!confirm(`Are you sure you want to delete the assessment for "${businessName}"?`)) {
      return;
    }

    try {
      await assessmentAPI.delete(id);
      toast.success('Assessment deleted successfully');
      loadAssessments();
    } catch (error: any) {
      console.error('Failed to delete assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assessment');
    }
  };

  const handleContinue = (id: string) => {
    router.push(`/assessment/${id}`);
  };

  const handleViewResults = (id: string) => {
    router.push(`/assessment/${id}/results`);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" />
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your digital readiness assessments and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm font-medium text-gray-500">Total Assessments</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{assessments.length}</div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm font-medium text-gray-500">Completed</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {assessments.filter((a) => a.status === AssessmentStatus.COMPLETED).length}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {assessments.filter((a) => a.status === AssessmentStatus.IN_PROGRESS).length}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-sm font-medium text-gray-500">Average Score</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {assessments.filter((a) => a.overallScore != null).length > 0
              ? Math.round(
                  assessments
                    .filter((a) => a.overallScore != null)
                    .reduce((sum, a) => sum + (a.overallScore ?? 0), 0) /
                    assessments.filter((a) => a.overallScore != null).length
                )
              : '-'}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="ALL">All Status</option>
              <option value={AssessmentStatus.DRAFT}>Draft</option>
              <option value={AssessmentStatus.IN_PROGRESS}>In Progress</option>
              <option value={AssessmentStatus.SUBMITTED}>Submitted</option>
              <option value={AssessmentStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-by" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
            </select>
          </div>
        </div>

        {/* New Assessment Button */}
        <Link
          href="/assessment/new"
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Assessment
        </Link>
      </div>

      {/* Assessment List */}
      {filteredAssessments.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter !== 'ALL'
              ? 'Try changing the filter or create a new assessment.'
              : 'Get started by creating your first assessment.'}
          </p>
          {statusFilter === 'ALL' && (
            <div className="mt-6">
              <Link
                href="/assessment/new"
                className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Assessment
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {assessment.businessProfile?.businessName || 'Unknown Business'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {assessment.businessProfile?.industry} •{' '}
                      {assessment.businessProfile?.businessSize}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getAssessmentStatusColor(
                      assessment.status
                    )}`}
                  >
                    {getAssessmentStatusLabel(assessment.status)}
                  </span>
                </div>

                {/* Scores (if completed) */}
                {assessment.status === AssessmentStatus.COMPLETED &&
                  assessment.overallScore != null && (
                    <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Overall</div>
                        <div
                          className={`mt-1 text-2xl font-bold ${getScoreColor(
                            assessment.overallScore
                          )}`}
                        >
                          {Math.round(assessment.overallScore)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Digital</div>
                        <div
                          className={`mt-1 text-2xl font-bold ${getScoreColor(
                            assessment.digitalScore ?? 0
                          )}`}
                        >
                          {Math.round(assessment.digitalScore ?? 0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Legacy</div>
                        <div
                          className={`mt-1 text-2xl font-bold ${getScoreColor(
                            assessment.legacyScore ?? 0
                          )}`}
                        >
                          {Math.round(assessment.legacyScore ?? 0)}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Metadata */}
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="mr-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Started: {new Date(assessment.startedAt).toLocaleDateString()}
                  </div>
                  {assessment.completedAt && (
                    <div className="flex items-center">
                      <svg
                        className="mr-1.5 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Completed: {new Date(assessment.completedAt).toLocaleDateString()}
                    </div>
                  )}
                  {assessment._count && (
                    <div className="flex items-center">
                      <svg
                        className="mr-1.5 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      {assessment._count.responses} responses
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {assessment.status === AssessmentStatus.COMPLETED ? (
                    <button
                      onClick={() => handleViewResults(assessment.id)}
                      className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => handleContinue(assessment.id)}
                      className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                    >
                      {assessment.status === AssessmentStatus.DRAFT
                        ? 'Start Assessment'
                        : 'Continue'}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleDelete(
                        assessment.id,
                        assessment.businessProfile?.businessName || 'Unknown Business'
                      )
                    }
                    className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Placeholder */}
      {filteredAssessments.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredAssessments.length} of {assessments.length} assessment
          {assessments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
