
'use client';
import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ExamSession, type SubmissionDetails } from '@/components/candidate/exam-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Check, ShieldCheck, Video, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

export default function ExamPage() {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const examId = params.id as string;

  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);

  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [unansweredQuestionsCount, setUnansweredQuestionsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartExam = async () => {
    setError(null);
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsExamStarted(true);
      } catch (err) {
        console.error('Could not enter fullscreen mode:', err);
        setError('Fullscreen mode is required to start the exam. Please allow it and try again.');
      }
    }
  };

  const handleTermination = useCallback((reason: string) => {
    setTerminationReason(reason);
    setIsTerminated(true);
    setIsExamStarted(false);
  }, []);

  const handleSuccessfulSubmit = useCallback((details: SubmissionDetails) => {
    setSubmissionDetails(details);
    setIsSubmitted(true);
    setIsExamStarted(false);
  }, []);

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    handleSuccessfulSubmit({
        totalQuestions: 10, // This would come from a real data source
        attempted: 10 - unansweredQuestionsCount,
        unattempted: unansweredQuestionsCount,
        submissionTime: new Date(),
    });

    setIsSubmitting(false);
    setSubmitDialogOpen(false);
  };
  
  const renderContent = () => {
    if (isExamStarted) {
      return (
        <ExamSession
          examId={examId}
          onTerminate={handleTermination}
          onSuccessfulSubmit={handleSuccessfulSubmit}
          setUnansweredQuestionsCount={setUnansweredQuestionsCount}
        />
      );
    }

    if (isTerminated) {
      return (
        <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    {terminationReason.includes("Time's up") ? "Time's Up" : "Exam Terminated"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{terminationReason}</AlertDialogDescription>
                </AlertDialogHeader>
                <CardFooter className="pt-6">
                    <Button className="w-full" onClick={() => (window.location.href = '/dashboard')}>
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
      );
    }
    
    if (isSubmitted && submissionDetails) {
        return (
             <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="items-center text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-2"/>
                        <CardTitle className="text-2xl">Exam Submitted Successfully</CardTitle>
                        <CardDescription>Your responses have been recorded.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border divide-y">
                            <div className="flex justify-between p-3">
                                <span className="text-muted-foreground">Total Questions</span>
                                <span className="font-medium">{submissionDetails.totalQuestions}</span>
                            </div>
                            <div className="flex justify-between p-3">
                                <span className="text-muted-foreground">Attempted</span>
                                <span className="font-medium">{submissionDetails.attempted}</span>
                            </div>
                            <div className="flex justify-between p-3">
                                <span className="text-muted-foreground">Unattempted</span>
                                <span className="font-medium">{submissionDetails.unattempted}</span>
                            </div>
                            <div className="flex justify-between p-3">
                                <span className="text-muted-foreground">Submission Time</span>
                                <span className="font-medium">{submissionDetails.submissionTime.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">You may now close this window or return to your dashboard.</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={() => (window.location.href = '/dashboard')}>Return to Dashboard</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
       <div className="flex h-screen items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Begin?</CardTitle>
              <CardDescription>
                Exam ID: {examId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Please review the following rules before you start:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>The exam will be conducted in mandatory fullscreen mode. Exiting fullscreen will terminate the session.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Video className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>Your webcam and microphone will be monitored throughout the exam.</span>
                </li>
                 <li className="flex items-start gap-2">
                  <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>Switching tabs or applications is not allowed and will be flagged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>Ensure you have a stable internet connection.</span>
                </li>
              </ul>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button size="lg" className="w-full" onClick={handleStartExam}>
                Start Exam & Enter Fullscreen
              </Button>
            </CardContent>
          </Card>
        </div>
    );
  };

  if (!examId) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background text-foreground"
    >
        {renderContent()}
         <AlertDialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You cannot make any changes after submitting.
                        {unansweredQuestionsCount > 0 && (
                            <span className="font-semibold block mt-2 text-destructive">
                                You have {unansweredQuestionsCount} unanswered question{unansweredQuestionsCount > 1 ? 's' : ''}.
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirmSubmit} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Please wait...' : 'Yes, Submit Now'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
