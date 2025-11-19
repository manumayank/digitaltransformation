'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your digital readiness assessments and track your progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="card card-hover">
          <div className="mb-2 text-sm font-medium text-gray-600">Total Assessments</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="mt-2 text-sm text-gray-500">No assessments yet</div>
        </div>

        <div className="card card-hover">
          <div className="mb-2 text-sm font-medium text-gray-600">Completed</div>
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="mt-2 text-sm text-gray-500">Get started with your first assessment</div>
        </div>

        <div className="card card-hover">
          <div className="mb-2 text-sm font-medium text-gray-600">Average Score</div>
          <div className="text-3xl font-bold text-gray-900">--</div>
          <div className="mt-2 text-sm text-gray-500">Complete an assessment to see your score</div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Getting Started</h2>
        <p className="mb-6 text-gray-600">
          Take your first digital readiness assessment to understand your business's strengths and
          areas for improvement.
        </p>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              1
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Create Business Profile</h3>
              <p className="text-sm text-gray-600">
                Tell us about your business, industry, and size
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              2
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Complete Assessment</h3>
              <p className="text-sm text-gray-600">
                Answer questions across 10 modules covering all aspects of digital readiness
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              3
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Get Your Results</h3>
              <p className="text-sm text-gray-600">
                View detailed scores, risk flags, and personalized recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/business-profile/create">
            <Button>Create Business Profile</Button>
          </Link>
          <Link href="/assessment/new">
            <Button variant="outline">Start Assessment</Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
