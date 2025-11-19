import { Module } from '@/lib/api/module.api';
import { getModuleCategoryLabel, getModuleIcon } from '@/lib/api/module.api';

interface ModuleNavProps {
  modules: Module[];
  currentModuleIndex: number;
  getModuleProgress: (moduleId: string) => {
    totalQuestions: number;
    answeredQuestions: number;
    percentage: number;
  };
  onModuleClick: (index: number) => void;
}

export default function ModuleNav({
  modules,
  currentModuleIndex,
  getModuleProgress,
  onModuleClick,
}: ModuleNavProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Assessment Modules
      </h3>
      <div className="space-y-1">
        {modules.map((module, index) => {
          const progress = getModuleProgress(module.id);
          const isActive = index === currentModuleIndex;
          const isCompleted = progress.percentage === 100;

          return (
            <button
              key={module.id}
              onClick={() => onModuleClick(index)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-100 text-primary-900 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {getModuleIcon(module.category)}
                    </span>
                    <span className="text-sm truncate">
                      {getModuleCategoryLabel(module.category)}
                    </span>
                  </div>
                  {progress.totalQuestions > 0 && (
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isCompleted ? 'bg-success-600' : 'bg-primary-600'
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums">
                          {progress.answeredQuestions}/{progress.totalQuestions}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {isCompleted && (
                  <svg
                    className="h-5 w-5 text-success-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
