'use client';
import { Button } from '@/components/ui/button';

interface SubmitExamButtonProps {
  unansweredQuestionsCount: number;
  onNavigateToConfirm: () => void;
}

export function SubmitExamButton({
  unansweredQuestionsCount,
  onNavigateToConfirm,
}: SubmitExamButtonProps) {
  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full"
      onClick={onNavigateToConfirm}
    >
      Submit Exam
    </Button>
  );
}
