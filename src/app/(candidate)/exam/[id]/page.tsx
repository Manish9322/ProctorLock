
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, ShieldCheck, Video, CheckCircle2, AlertTriangle, FileQuestion, HelpCircle, CheckSquare, ChevronLeft } from 'lucide-react';
import { ExamSession, type SubmissionDetails } from '@/components/candidate/exam-session';
import { useToast } from '@/hooks/use-toast';


const ConfirmSubmissionView = ({
    unansweredCount,
    totalQuestions,
    onConfirm,
    onCancel,
    isSubmitting
}: {
    unansweredCount: number;
    totalQuestions: number;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
}) => {
  return (
    <div className="flex h-screen items-center justify-center bg-muted/40 p-4">
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
                <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Return to Exam
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit Exam'}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
};


const SubmissionSuccessView = ({ submissionDetails }: { submissionDetails: SubmissionDetails }) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        if (countdown <= 0) {
            router.push('/dashboard');
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, router]);

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
                    <p className="text-center text-sm text-muted-foreground">
                        You will be redirected to the dashboard in {countdown} seconds.
                    </p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
                </CardFooter>
            </Card>
        </div>
    );
};


export default function ExamPage() {
  const [view, setView] = useState<'start' | 'exam' | 'confirm' | 'terminated' | 'submitted'>('start');
  const [terminationReason, setTerminationReason] = useState('');
  const [submissionDetails, setSubmissionDetails] = useState<SubmissionDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.id as string;
  
  useEffect(() => {
    if (searchParams.get('submitted') === 'true') {
        const savedState = localStorage.getItem(`examState-${examId}`);
        if (savedState) {
            const { answers, questions } = JSON.parse(savedState);
            const totalQuestions = questions?.length || 10;
            const details: SubmissionDetails = {
                totalQuestions: totalQuestions,
                attempted: Object.keys(answers).length,
                unattempted: totalQuestions - Object.keys(answers).length,
                submissionTime: new Date(),
            };
            handleSuccessfulSubmit(details);
        } else {
             const details: SubmissionDetails = {
                totalQuestions: 10,
                attempted: 10,
                unattempted: 0,
                submissionTime: new Date(),
            };
            handleSuccessfulSubmit(details);
        }
    }
  }, [examId, searchParams]);
  
  useEffect(() => {
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [stream]);

  const handleStartExam = async () => {
    setError(null);
    if (containerRef.current) {
        try {
            await containerRef.current.requestFullscreen();
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            setView('exam');
        } catch (err) {
            console.error("Could not enter fullscreen mode or get media:", err);
            setError("Fullscreen mode and camera/mic access are required. Please allow them and try again.");
        }
    }
  };

  const handleTermination = useCallback((reason: string) => {
    setTerminationReason(reason);
    setView('terminated');
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
  }, [stream]);

  const handleSuccessfulSubmit = useCallback((details: SubmissionDetails) => {
    setSubmissionDetails(details);
    setView('submitted');
     if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
     if (document.fullscreenElement) {
        document.exitFullscreen();
    }
  }, [stream]);
  
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Submission Successful',
      description: 'Your exam has been submitted.',
    });
    
    const savedState = localStorage.getItem(`examState-${examId}`);
    const { answers, questions } = JSON.parse(savedState || '{}');
    const totalQuestions = questions?.length || 10;
    const details: SubmissionDetails = {
        totalQuestions: totalQuestions,
        attempted: Object.keys(answers || {}).length,
        unattempted: totalQuestions - Object.keys(answers || {}).length,
        submissionTime: new Date(),
    };

    localStorage.removeItem(`examState-${examId}`);
    handleSuccessfulSubmit(details);
    setIsSubmitting(false);
  };
  
  const renderContent = () => {
    switch (view) {
        case 'exam':
            return (
                <ExamSession
                  examId={examId}
                  onTerminate={handleTermination}
                  onInitiateSubmit={() => setView('confirm')}
                  stream={stream}
                />
            );
        case 'confirm':
            const savedState = JSON.parse(localStorage.getItem(`examState-${examId}`) || '{}');
            const total = savedState.questions?.length || 10;
            const unanswered = total - Object.keys(savedState.answers || {}).length;
            return <ConfirmSubmissionView 
                unansweredCount={unanswered}
                totalQuestions={total}
                onConfirm={handleFinalSubmit}
                onCancel={() => setView('exam')}
                isSubmitting={isSubmitting}
            />
        case 'terminated':
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
        case 'submitted':
            if (submissionDetails) {
                return <SubmissionSuccessView submissionDetails={submissionDetails} />;
            }
            return null; // or a loading state
        case 'start':
        default:
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
    }
  };

  if (!examId) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-background text-foreground">
        {renderContent()}
    </div>
  );
}
