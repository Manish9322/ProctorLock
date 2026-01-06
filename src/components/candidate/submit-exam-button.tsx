'use client';
import { Button } from '@/components/ui/button';

interface SubmitExamButtonProps {
  onClick: () => void;
}

export function SubmitExamButton({
  onClick,
}: SubmitExamButtonProps) {
  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full"
      onClick={onClick}
    >
      Submit Exam
    </Button>
  );
}
