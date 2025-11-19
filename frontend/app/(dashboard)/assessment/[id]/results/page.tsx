'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { assessmentAPI, Assessment, ModuleScore } from '@/lib/api/assessment.api';
import { getModuleCategoryLabel, getModuleIcon, getModuleColor } from '@/lib/api/module.api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function AssessmentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentAPI.getById(assessmentId);

      // Check if assessment is scored
      if (data.status !== 'COMPLETED') {
        toast.error('Assessment has not been scored yet');
        router.push(`/assessment/${assessmentId}`);
        return;
      }

      setAssessment(data);
    } catch (error: any) {
      toast.error('Failed to load assessment results');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (isLoading || !assessment) {
    return <Loading />;
  }

  const overallScore = assessment.overallScore ?? 0;
  const digitalScore = assessment.digitalScore ?? 0;
  const legacyScore = assessment.legacyScore ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Assessment Results
              </h1>
              {assessment.businessProfile && (
                <p className="mt-2 text-gray-600">
                  {assessment.businessProfile.businessName}
                </p>
              )}
              {assessment.completedAt && (
                <p className="text-sm text-gray-500">
                  Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Overall Readiness Score</h2>
              <div className="text-7xl font-bold mb-4">
                {Math.round(overallScore)}
              </div>
              <div className="text-xl">{getScoreLabel(overallScore)}</div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-sm opacity-90">Digital Readiness</div>
                  <div className="text-3xl font-bold mt-2">{Math.round(digitalScore)}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-sm opacity-90">Legacy Transfer Readiness</div>
                  <div className="text-3xl font-bold mt-2">{Math.round(legacyScore)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Digital vs Legacy Readiness
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Digital Readiness</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(digitalScore)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${digitalScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Legacy Transfer Readiness</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(legacyScore)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${legacyScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Module Scores */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Module Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.moduleScores && assessment.moduleScores.length > 0 ? (
              assessment.moduleScores.map((moduleScore: ModuleScore) => (
                <div
                  key={moduleScore.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {moduleScore.module?.category && (
                        <span className="text-2xl">
                          {getModuleIcon(moduleScore.module.category as any)}
                        </span>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {moduleScore.module?.name || 'Unknown Module'}
                        </h4>
                        {moduleScore.module?.category && (
                          <p className="text-xs text-gray-500">
                            {getModuleCategoryLabel(moduleScore.module.category as any)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(moduleScore.score)}`}>
                      {Math.round(moduleScore.score)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${moduleScore.score}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No module scores available
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Questions</div>
            <div className="text-3xl font-bold text-gray-900">
              {assessment._count?.responses || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Modules Assessed</div>
            <div className="text-3xl font-bold text-gray-900">
              {assessment.moduleScores?.length || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Assessment Date</div>
            <div className="text-lg font-semibold text-gray-900">
              {assessment.completedAt
                ? new Date(assessment.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            View All Assessments
          </Button>
          <Button variant="primary" onClick={() => toast.info('PDF export coming soon!')}>
            Download Report (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
}
