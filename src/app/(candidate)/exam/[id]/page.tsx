
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Check, ShieldCheck, Video, CheckCircle2 } from 'lucide-react';
import { type SubmissionDetails } from '@/components/candidate/exam-session';
import { ExamContainer } from '@/components/candidate/exam-container';

export default function ExamPage() {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);

  const params = useParams();
  const examId = params.id as string;

  const handleStartExam = () => {
    setIsExamStarted(true);
  };

  const handleTermination = (reason: string) => {
    setTerminationReason(reason);
    setIsTerminated(true);
    setIsExamStarted(false);
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
  };

  const handleSuccessfulSubmit = (details: SubmissionDetails) => {
    setSubmissionDetails(details);
    setIsSubmitted(true);
    setIsExamStarted(false);
     if (document.fullscreenElement) {
        document.exitFullscreen();
    }
  };

  const renderContent = () => {
    if (isExamStarted) {
      return (
        <ExamContainer
          examId={examId}
          onTerminate={handleTermination}
          onSuccessfulSubmit={handleSuccessfulSubmit}
        />
      );
    }

    if (isTerminated) {
      return (
        <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader className="items-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-2" />
                    <CardTitle className="text-2xl">
                        {terminationReason.includes("Time's up") ? "Time's Up" : "Exam Terminated"}
                    </CardTitle>
                    <CardDescription>{terminationReason}</CardDescription>
                </CardHeader>
                <CardFooter>
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
    <div className="min-h-screen w-full bg-background text-foreground">
        {renderContent()}
    </div>
  );
}
