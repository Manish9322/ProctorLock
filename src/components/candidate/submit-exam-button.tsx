'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
