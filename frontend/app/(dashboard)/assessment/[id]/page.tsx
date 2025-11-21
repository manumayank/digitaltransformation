'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { moduleAPI } from '@/lib/api/module.api';
import { businessProfileAPI } from '@/lib/api/business-profile.api';
import { useAssessmentStore } from '@/lib/stores/assessment.store';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import ProgressBar from '@/components/assessment/ProgressBar';
import ModuleNav from '@/components/assessment/ModuleNav';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  const {
    initializeAssessment,
    setQuestionsForModule,
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToModule,
    getCurrentModule,
    getCurrentQuestion,
    getProgress,
    getModuleProgress,
    modules,
    answers,
    currentModuleIndex,
    currentQuestionIndex,
  } = useAssessmentStore();

  // Load assessment data
  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  // Load questions for current module
  useEffect(() => {
    const currentModule = getCurrentModule();
    if (currentModule && !modules.length) return;
    if (currentModule) {
      loadQuestionsForModule(currentModule.id);
    }
  }, [currentModuleIndex, modules]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);

      // Load assessment from API
      const { assessmentAPI } = await import('@/lib/api/assessment.api');
      const assessment = await assessmentAPI.getById(assessmentId);

      // Load business profile
      const profile = await businessProfileAPI.getById(assessment.businessProfileId);
      setBusinessProfile(profile);

      // Load all modules
      const allModules = await moduleAPI.getAll();

      // Initialize assessment in store
      initializeAssessment(assessmentId, assessment.businessProfileId, allModules);

      // Load existing responses into store
      if (assessment.responses && assessment.responses.length > 0) {
        assessment.responses.forEach((response) => {
          setAnswer(response.questionId, response.answer);
        });
      }
    } catch (error: any) {
      toast.error('Failed to load assessment');
      console.error(error);
      router.push('/assessment/new');
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuestionsForModule = async (moduleId: string) => {
    try {
      // Load questions filtered by business profile
      const response = await moduleAPI.getQuestions(moduleId, {
        industry: businessProfile?.industry,
        size: businessProfile?.businessSize,
      });

      setQuestionsForModule(moduleId, response.data);
    } catch (error: any) {
      toast.error('Failed to load questions');
      console.error(error);
    }
  };

  const handleAnswerChange = (value: any) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleNext = () => {
    const currentQuestion = getCurrentQuestion();

    // Check if required question is answered
    if (currentQuestion?.isRequired) {
      const answer = answers[currentQuestion.id];
      if (!answer || answer.value === null || answer.value === undefined || answer.value === '') {
        toast.error('Please answer this required question before continuing');
        return;
      }
    }

    nextQuestion();
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert answers to API format
      const { assessmentAPI } = await import('@/lib/api/assessment.api');
      const responses = Object.values(answers).map((answer) => ({
        questionId: answer.questionId,
        answer: answer.value,
      }));

      await assessmentAPI.saveResponses(assessmentId, { responses });

      toast.success('Progress saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const progress = getProgress();

    if (progress.percentage < 100) {
      const confirmed = confirm(
        `You have only answered ${progress.answeredQuestions} out of ${progress.totalQuestions} questions (${Math.round(progress.percentage)}%). Do you want to submit anyway?`
      );
      if (!confirmed) return;
    }

    try {
      setIsSaving(true);

      // First save any pending responses
      const { assessmentAPI } = await import('@/lib/api/assessment.api');
      const responses = Object.values(answers).map((answer) => ({
        questionId: answer.questionId,
        answer: answer.value,
      }));

      if (responses.length > 0) {
        await assessmentAPI.saveResponses(assessmentId, { responses });
      }

      // Then submit the assessment
      await assessmentAPI.submit(assessmentId);

      toast.success('Assessment submitted and scored successfully!');
      router.push(`/assessment/${assessmentId}/results`);
    } catch (error: any) {
      toast.error('Failed to submit assessment');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const currentModule = getCurrentModule();
  const currentQuestion = getCurrentQuestion();
  const currentAnswer = currentQuestion ? answers[currentQuestion.id]?.value : null;
  const progress = getProgress();

  const isFirstQuestion = currentModuleIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion = Boolean(
    currentModuleIndex === modules.length - 1 &&
    currentQuestion &&
    currentQuestionIndex ===
      (useAssessmentStore.getState().questionsByModule[currentModule?.id || '']
        ?.length || 0) -
        1
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Digital Readiness Assessment
              </h1>
              {businessProfile && (
                <p className="mt-2 text-gray-600">
                  Business: {businessProfile.businessName}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleSave} isLoading={isSaving}>
                Save Progress
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit Assessment
              </Button>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-6">
            <ProgressBar
              current={progress.answeredQuestions}
              total={progress.totalQuestions}
              label="Overall Progress"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ModuleNav
                modules={modules}
                currentModuleIndex={currentModuleIndex}
                getModuleProgress={getModuleProgress}
                onModuleClick={goToModule}
              />
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            {currentModule && currentQuestion ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Module Header */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {currentModule.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {currentModule.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                      Question {currentQuestionIndex + 1} of{' '}
                      {useAssessmentStore.getState().questionsByModule[currentModule.id]
                        ?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <QuestionRenderer
                    question={currentQuestion}
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                  >
                    ← Previous
                  </Button>

                  <div className="text-sm text-gray-500">
                    Module {currentModuleIndex + 1} of {modules.length}
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={isLastQuestion}
                  >
                    {isLastQuestion ? 'Finished' : 'Next →'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-500">
                  No questions available for this module.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
