'use client';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface SubmitExamButtonProps {
  unansweredQuestionsCount: number;
  onConfirmSubmit: () => Promise<void>;
}

export function SubmitExamButton({
  unansweredQuestionsCount,
  onConfirmSubmit,
}: SubmitExamButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await onConfirmSubmit();
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full">
          Submit Exam
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
          <AlertDialogDescription>
            You cannot make any changes after submitting.
            {unansweredQuestionsCount > 0 && (
              <span className="mt-2 block font-semibold text-destructive">
                You have {unansweredQuestionsCount} unanswered question
                {unansweredQuestionsCount > 1 ? 's' : ''}.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleFinalSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : 'Yes, Submit Now'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
