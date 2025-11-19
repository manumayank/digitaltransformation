import { Question } from '@/lib/api/module.api';

interface ScaleQuestionProps {
  question: Question;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function ScaleQuestion({
  question,
  value,
  onChange,
  disabled = false,
}: ScaleQuestionProps) {
  const min = question.scaleMin ?? 0;
  const max = question.scaleMax ?? 10;
  const scaleValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-4">
      {/* Scale selector */}
      <div className="space-y-4">
        {/* Visual scale with buttons */}
        <div className="flex items-center justify-between gap-2">
          {scaleValues.map((scaleValue) => (
            <button
              key={scaleValue}
              type="button"
              onClick={() => onChange(scaleValue)}
              disabled={disabled}
              className={`flex-1 py-3 px-2 text-center font-medium rounded-lg border-2 transition-all ${
                value === scaleValue
                  ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {scaleValue}
            </button>
          ))}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min} - Not at all</span>
          <span>{max} - Completely</span>
        </div>

        {/* Current value display */}
        {value !== null && (
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <span className="text-sm font-medium text-primary-900">
              Selected: {value}
            </span>
          </div>
        )}
      </div>

      {question.helpText && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">💡 {question.helpText}</p>
        </div>
      )}
    </div>
  );
}
