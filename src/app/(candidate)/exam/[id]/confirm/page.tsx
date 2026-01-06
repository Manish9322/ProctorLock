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
import {
  AlertTriangle,
  ChevronLeft,
  FileQuestion,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data, should be consistent with ExamSession
const TOTAL_QUESTIONS = 10;

export default function ConfirmSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(TOTAL_QUESTIONS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(`examState-${examId}`);
      if (savedState) {
        const { answers, questions } = JSON.parse(savedState);
        const total = questions?.length || TOTAL_QUESTIONS;
        setTotalQuestions(total);
        setUnansweredCount(total - Object.keys(answers).length);
      }
    }
  }, [examId]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Submission Successful',
      description: 'Your exam has been submitted.',
    });

    // Clear the saved state for this exam
    localStorage.removeItem(`examState-${examId}`);
    
    // Redirect to the exam page with a submitted flag
    router.push(`/exam/${examId}?submitted=true`);
  };

  const handleReturnToExam = () => {
    router.back();
  };

  return (
     <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Exam Submission</CardTitle>
          <CardDescription>
            You are about to end your exam. Please review the summary below before confirming. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {unansweredCount > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>You have unanswered questions!</AlertTitle>
              <AlertDescription>
                You have{' '}
                <span className="font-bold">
                  {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}
                </span>
                . Are you sure you want to submit?
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border divide-y">
            <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                    <FileQuestion className="h-5 w-5 text-muted-foreground"/>
                    <span className="font-medium">Total Questions</span>
                </div>
                <span className="font-bold text-lg">{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 text-muted-foreground"/>
                    <span className="font-medium">Answered</span>
                </div>
                <span className="font-semibold text-lg">{totalQuestions - unansweredCount}</span>
            </div>
            <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground"/>
                    <span className="font-medium">Unanswered</span>
                </div>
                <span className="font-semibold text-lg">{unansweredCount}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReturnToExam} disabled={isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Return to Exam
          </Button>
          <Button
            variant="destructive"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit Exam'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
