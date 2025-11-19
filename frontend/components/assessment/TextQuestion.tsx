import { Question } from '@/lib/api/module.api';

interface TextQuestionProps {
  question: Question;
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TextQuestion({
  question,
  value,
  onChange,
  disabled = false,
}: TextQuestionProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        placeholder="Enter your answer here..."
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {value && (
        <div className="text-sm text-gray-500">
          {value.length} character{value.length !== 1 ? 's' : ''}
        </div>
      )}

      {question.helpText && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">💡 {question.helpText}</p>
        </div>
      )}
    </div>
  );
}
