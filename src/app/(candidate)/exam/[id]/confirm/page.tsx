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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, FileQuestion, HelpCircle, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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

    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    
    router.push(`/exam/${examId}?submitted=true`);
  };

  const answeredCount = totalQuestions - unansweredCount;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Submission</CardTitle>
          <CardDescription>
            You are about to end your exam. Please review the details below before you confirm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {unansweredCount > 0 && (
                 <Alert variant="destructive" className="border-2 border-destructive/80">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-bold">You have unanswered questions!</AlertTitle>
                    <AlertDescription>
                        You have <span className="font-bold">{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</span>. Are you sure you want to submit?
                    </AlertDescription>
                </Alert>
            )}

            <div className="rounded-md border divide-y">
                 <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                        <FileQuestion className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-medium">Total Questions</span>
                    </div>
                    <span className="font-bold text-lg">{totalQuestions}</span>
                </div>
                 <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                         <CheckSquare className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-medium">Answered</span>
                    </div>
                    <span className="font-semibold text-lg">{answeredCount}</span>
                </div>
                 <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-medium">Unanswered</span>
                    </div>
                    <span className="font-semibold text-lg">{unansweredCount}</span>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                You cannot make any changes after submission.
            </p>
          
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Return to Exam
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
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
