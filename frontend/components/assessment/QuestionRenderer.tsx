import { Question, QuestionType } from '@/lib/api/module.api';
import YesNoQuestion from './YesNoQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ScaleQuestion from './ScaleQuestion';
import TextQuestion from './TextQuestion';
import FileUploadQuestion from './FileUploadQuestion';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
}: QuestionRendererProps) {
  // Render appropriate component based on question type
  const renderQuestion = () => {
    switch (question.questionType) {
      case QuestionType.YES_NO:
        return (
          <YesNoQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QuestionType.SCALE:
        return (
          <ScaleQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QuestionType.TEXT:
        return (
          <TextQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QuestionType.FILE_UPLOAD:
        return (
          <FileUploadQuestion
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Unsupported question type: {question.questionType}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {question.questionText}
            {question.isRequired && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </h3>
          <span className="ml-4 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Weight: {question.weight}
          </span>
        </div>
      </div>

      {/* Question component */}
      {renderQuestion()}

      {/* Required indicator */}
      {question.isRequired && !value && (
        <p className="text-sm text-gray-500">
          * This question is required
        </p>
      )}
    </div>
  );
}
