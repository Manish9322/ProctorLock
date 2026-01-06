'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ConfirmSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const examId = params.id as string;

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(`examState-${examId}`);
    if (savedState) {
      const { answers, totalQuestions } = JSON.parse(savedState);
      setTotalQuestions(totalQuestions);
      setUnansweredCount(totalQuestions - Object.keys(answers).length);
    }
  }, [examId]);

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Submission Successful',
      description: 'Your exam has been submitted.',
    });

    // In a real app, you would likely clear the exam state from local storage
    // localStorage.removeItem(`examState-${examId}`);
    
    // This is a bit of a hack to break out of the fullscreen mode that the previous page was in.
    // A more robust solution might involve signaling the exam page to exit fullscreen before navigating.
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    
    // Redirect to the dashboard. The exam page itself will handle showing the final submission summary.
    router.push(`/exam/${examId}?submitted=true`);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Submission</CardTitle>
          <CardDescription>
            Are you sure you want to end your exam? You cannot make any changes after submitting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unansweredCount > 0 && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-md border border-amber-500/50 bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">
                You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Total Questions: {totalQuestions}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Return to Exam
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Confirm & Submit Exam'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
