'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  assessmentAPI,
  Assessment,
  RiskLevel,
  RecommendationPriority,
  getRiskLevelLabel,
  getRiskLevelColor,
  getRecommendationPriorityLabel,
  getRecommendationPriorityColor,
} from '@/lib/api/assessment.api';
import { getModuleCategoryLabel, getModuleIcon, getModuleColor } from '@/lib/api/module.api';

export default function AssessmentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'recommendations'>('overview');

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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const overallScore = assessment.overallScore ?? 0;
  const digitalScore = assessment.digitalScore ?? 0;
  const legacyScore = assessment.legacyScore ?? 0;
  const risks = assessment.riskFlags || [];
  const recommendations = assessment.recommendations || [];

  // Group risks by level
  const criticalRisks = risks.filter((r) => r.riskLevel === RiskLevel.CRITICAL);
  const highRisks = risks.filter((r) => r.riskLevel === RiskLevel.HIGH);
  const mediumRisks = risks.filter((r) => r.riskLevel === RiskLevel.MEDIUM);
  const lowRisks = risks.filter((r) => r.riskLevel === RiskLevel.LOW);

  // Group recommendations by priority
  const immediateRecs = recommendations.filter((r) => r.priority === RecommendationPriority.IMMEDIATE);
  const shortTermRecs = recommendations.filter((r) => r.priority === RecommendationPriority.SHORT_TERM);
  const mediumTermRecs = recommendations.filter((r) => r.priority === RecommendationPriority.MEDIUM_TERM);
  const longTermRecs = recommendations.filter((r) => r.priority === RecommendationPriority.LONG_TERM);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
              {assessment.businessProfile && (
                <p className="mt-2 text-gray-600">{assessment.businessProfile.businessName}</p>
              )}
              {assessment.completedAt && (
                <p className="text-sm text-gray-500">
                  Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="mb-8">
          <div className="rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white shadow-lg">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-semibold">Overall Readiness Score</h2>
              <div className="mb-4 text-7xl font-bold">{Math.round(overallScore)}</div>
              <p className="text-xl">{getScoreLabel(overallScore)}</p>
              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm opacity-90">Digital Readiness</p>
                  <p className="text-4xl font-bold">{Math.round(digitalScore)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Legacy Transfer Readiness</p>
                  <p className="text-4xl font-bold">{Math.round(legacyScore)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Module Scores
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'risks'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Risk Analysis
                {risks.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    {risks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === 'recommendations'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Recommendations
                {recommendations.length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                    {recommendations.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Score Comparison */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Score Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Digital Readiness</span>
                    <span className="font-semibold text-gray-900">{Math.round(digitalScore)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${digitalScore}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Legacy Transfer Readiness</span>
                    <span className="font-semibold text-gray-900">{Math.round(legacyScore)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${legacyScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module Breakdown */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Module Breakdown</h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {assessment.moduleScores?.map((moduleScore) => {
                  const icon = getModuleIcon(moduleScore.module?.category || '');
                  const color = getModuleColor(moduleScore.module?.category || '');
                  const score = Math.round(moduleScore.score);

                  return (
                    <div key={moduleScore.id} className="rounded-lg bg-white p-6 shadow">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl">{icon}</span>
                          <div className="ml-3">
                            <h4 className="font-semibold text-gray-900">
                              {moduleScore.module?.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {getModuleCategoryLabel(moduleScore.module?.category || '')}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getScoreColor(
                            score
                          )}`}
                        >
                          {score}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div>
            {risks.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Risks Detected</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Great! Your assessment shows no significant risk flags.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Risk Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                    <div className="text-sm font-medium text-red-600">Critical</div>
                    <div className="mt-1 text-3xl font-bold text-red-900">{criticalRisks.length}</div>
                  </div>
                  <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
                    <div className="text-sm font-medium text-orange-600">High</div>
                    <div className="mt-1 text-3xl font-bold text-orange-900">{highRisks.length}</div>
                  </div>
                  <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
                    <div className="text-sm font-medium text-yellow-600">Medium</div>
                    <div className="mt-1 text-3xl font-bold text-yellow-900">{mediumRisks.length}</div>
                  </div>
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                    <div className="text-sm font-medium text-blue-600">Low</div>
                    <div className="mt-1 text-3xl font-bold text-blue-900">{lowRisks.length}</div>
                  </div>
                </div>

                {/* Risk List */}
                <div className="space-y-4">
                  {risks.map((risk) => (
                    <div key={risk.id} className="rounded-lg border-2 bg-white p-6 shadow-sm">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRiskLevelColor(
                                risk.riskLevel
                              )}`}
                            >
                              {getRiskLevelLabel(risk.riskLevel)}
                            </span>
                            <span className="text-xs text-gray-500">{risk.category}</span>
                          </div>
                          <h4 className="mt-2 text-lg font-semibold text-gray-900">{risk.title}</h4>
                        </div>
                      </div>
                      <p className="mb-4 text-gray-700">{risk.description}</p>
                      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                        <div>
                          <h5 className="mb-1 text-sm font-semibold text-gray-900">Impact:</h5>
                          <p className="text-sm text-gray-700">{risk.impact}</p>
                        </div>
                        {risk.mitigation && (
                          <div>
                            <h5 className="mb-1 text-sm font-semibold text-gray-900">
                              Mitigation:
                            </h5>
                            <p className="text-sm text-gray-700">{risk.mitigation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            {recommendations.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Recommendations</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No specific recommendations generated for this assessment.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recommendations by Priority */}
                {immediateRecs.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Immediate Priority (0-30 days)
                    </h3>
                    <div className="space-y-4">
                      {immediateRecs.map((rec) => (
                        <RecommendationCard key={rec.id} recommendation={rec} />
                      ))}
                    </div>
                  </div>
                )}

                {shortTermRecs.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Short Term (30-90 days)
                    </h3>
                    <div className="space-y-4">
                      {shortTermRecs.map((rec) => (
                        <RecommendationCard key={rec.id} recommendation={rec} />
                      ))}
                    </div>
                  </div>
                )}

                {mediumTermRecs.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Medium Term (90-180 days)
                    </h3>
                    <div className="space-y-4">
                      {mediumTermRecs.map((rec) => (
                        <RecommendationCard key={rec.id} recommendation={rec} />
                      ))}
                    </div>
                  </div>
                )}

                {longTermRecs.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Long Term (180+ days)
                    </h3>
                    <div className="space-y-4">
                      {longTermRecs.map((rec) => (
                        <RecommendationCard key={rec.id} recommendation={rec} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View All Assessments
          </button>
          <button
            className="rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
            onClick={() => toast.info('PDF generation coming soon!')}
          >
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border-2 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRecommendationPriorityColor(
                recommendation.priority
              )}`}
            >
              {getRecommendationPriorityLabel(recommendation.priority)}
            </span>
            {recommendation.module && (
              <span className="text-xs text-gray-500">{recommendation.module.name}</span>
            )}
          </div>
          <h4 className="mt-2 text-lg font-semibold text-gray-900">{recommendation.title}</h4>
        </div>
      </div>

      <p className="mb-4 text-gray-700">{recommendation.description}</p>

      <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
        {recommendation.estimatedCost && (
          <div>
            <div className="text-xs font-medium text-gray-500">Estimated Cost</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {recommendation.estimatedCost}
            </div>
          </div>
        )}
        {recommendation.estimatedTimeframe && (
          <div>
            <div className="text-xs font-medium text-gray-500">Timeframe</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">
              {recommendation.estimatedTimeframe}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {isExpanded ? 'Show Less' : 'Show More Details'}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          <div>
            <h5 className="mb-2 text-sm font-semibold text-gray-900">Expected Impact:</h5>
            <p className="text-sm text-gray-700">{recommendation.expectedImpact}</p>
          </div>

          {recommendation.valuationImpact && (
            <div>
              <h5 className="mb-2 text-sm font-semibold text-gray-900">Valuation Impact:</h5>
              <p className="text-sm text-gray-700">{recommendation.valuationImpact}</p>
            </div>
          )}

          {recommendation.implementationSteps && recommendation.implementationSteps.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-semibold text-gray-900">Implementation Steps:</h5>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">
                {recommendation.implementationSteps.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {recommendation.resources && recommendation.resources.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-semibold text-gray-900">Resources:</h5>
              <ul className="space-y-2">
                {recommendation.resources.map((resource: any, idx: number) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium text-gray-900">{resource.title}</span>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary-600 hover:text-primary-700"
                      >
                        →
                      </a>
                    )}
                    {resource.description && (
                      <p className="text-gray-600">{resource.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
