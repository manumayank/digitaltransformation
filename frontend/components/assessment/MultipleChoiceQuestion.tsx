import { Question } from '@/lib/api/module.api';

interface MultipleChoiceQuestionProps {
  question: Question;
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  // Parse options from JSON
  const options = Array.isArray(question.options)
    ? question.options
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        {options.map((option: string | { value: string; label: string }, index: number) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;

          return (
            <label
              key={index}
              className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
            >
              <input
                type="radio"
                name={question.id}
                value={optionValue}
                checked={value === optionValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-900">
                {optionLabel}
              </span>
            </label>
          );
        })}
      </div>

      {question.helpText && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">💡 {question.helpText}</p>
        </div>
      )}
    </div>
  );
}
