import { Question } from '@/lib/api/module.api';

interface YesNoQuestionProps {
  question: Question;
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function YesNoQuestion({
  question,
  value,
  onChange,
  disabled = false,
}: YesNoQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
          <input
            type="radio"
            name={question.id}
            checked={value === true}
            onChange={() => onChange(true)}
            disabled={disabled}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </label>

        <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50">
          <input
            type="radio"
            name={question.id}
            checked={value === false}
            onChange={() => onChange(false)}
            disabled={disabled}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-900">No</span>
        </label>
      </div>

      {question.helpText && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">💡 {question.helpText}</p>
        </div>
      )}
    </div>
  );
}
