'use client';

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Bookmark, CheckSquare, Square, AlertTriangle, FileQuestion, HelpCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SubmitExamButton } from './submit-exam-button';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


type ActivityLog = {
  type: 'focus' | 'activity' | 'snapshot';
  event: string;
  timestamp: string;
};

type Question = {
  id: string;
  type: 'mcq';
  text: string;
  options: string[];
};

type QuestionStatus = 'unvisited' | 'answered' | 'unanswered' | 'review' | 'answered_review';

export type SubmissionDetails = {
    totalQuestions: number;
    attempted: number;
    unattempted: number;
    submissionTime: Date;
}

// Mock Data
const mockQuestions: Question[] = [
  { id: 'q1', type: 'mcq', text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'] },
  { id: 'q2', type: 'mcq', text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'] },
  { id: 'q3', type: 'mcq', text: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'] },
  { id: 'q4', type: 'mcq', text: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'] },
  { id: 'q5', type: 'mcq', text: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'F. Scott Fitzgerald'] },
  { id: 'q6', type: 'mcq', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell Membrane'] },
  { id: 'q7', type: 'mcq', text: 'In which year did the Titanic sink?', options: ['1905', '1912', '1918', '1923'] },
  { id: 'q8', type: 'mcq', text: 'What is the square root of 64?', options: ['6', '7', '8', '9'] },
  { id: 'q9', type: 'mcq', text: 'Which element has the atomic number 1?', options: ['Helium', 'Oxygen', 'Hydrogen', 'Lithium'] },
  { id: 'q10', type: 'mcq', text: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'] },
];

const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes

const useExamState = (examId: string) => {
    const getInitialState = <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;
        const saved = localStorage.getItem(`examState-${examId}-${key}`);
        return saved ? JSON.parse(saved) : defaultValue;
    };

    const [answers, setAnswers] = useState<{ [key: string]: string }>(() => getInitialState('answers', {}));
    const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>(() => getInitialState('markedForReview', {}));
    const [timeLeft, setTimeLeft] = useState<number>(() => getInitialState('timeLeft', EXAM_DURATION_SECONDS));

    useEffect(() => {
        localStorage.setItem(`examState-${examId}-answers`, JSON.stringify(answers));
    }, [answers, examId]);

    useEffect(() => {
        localStorage.setItem(`examState-${examId}-markedForReview`, JSON.stringify(markedForReview));
    }, [markedForReview, examId]);
    
    useEffect(() => {
        localStorage.setItem(`examState-${examId}-timeLeft`, JSON.stringify(timeLeft));
    }, [timeLeft, examId]);

    return { answers, setAnswers, markedForReview, setMarkedForReview, timeLeft, setTimeLeft };
};


const TimeTracker = ({ timeLeft, duration }: { timeLeft: number; duration: number }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;
  
  const isLowTime = timeLeft <= 300; // 5 minutes or less

  return (
    <div className="flex items-center gap-4">
      <div className={cn(
        "text-lg font-semibold tabular-nums",
        isLowTime && "text-destructive"
      )}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="w-48">
        <Progress value={progress} className={cn("h-2", isLowTime && "[&>div]:bg-destructive")} />
      </div>
    </div>
  );
};

const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  answers,
  markedForReview,
  onSelectQuestion,
  onSubmitClick,
}: {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  markedForReview: { [key: string]: boolean };
  onSelectQuestion: (index: number) => void;
  onSubmitClick: () => void;
}) => {
  const getStatus = (index: number): QuestionStatus => {
    const questionId = questions[index].id;
    const isAnswered = !!answers[questionId];
    const isMarked = !!markedForReview[questionId];

    if (isAnswered && isMarked) return 'answered_review';
    if (isMarked) return 'review';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const unansweredQuestionsCount = questions.length - Object.keys(answers).length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Question Navigator</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, index) => {
            const status = getStatus(index);
            return (
               <TooltipProvider key={q.id} delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => onSelectQuestion(index)}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all",
                                    index === currentQuestionIndex && "ring-2 ring-primary ring-offset-2",
                                    status === 'answered' && "bg-foreground text-background",
                                    status === 'review' && "border-2 border-foreground",
                                    status === 'answered_review' && "bg-foreground text-background border-2 border-background ring-1 ring-foreground",
                                    status === 'unanswered' && "bg-muted/50"
                                )}
                            >
                                {index + 1}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Question {index + 1}: {status.replace('_', ' & ').charAt(0).toUpperCase() + status.replace('_', ' & ').slice(1)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Square className="h-4 w-4 bg-muted/50"/> Unanswered</div>
            <div className="flex items-center gap-2"><CheckSquare className="h-4 w-4 bg-foreground text-background border"/> Answered</div>
            <div className="flex items-center gap-2"><Bookmark className="h-4 w-4 border-2 border-foreground rounded-sm"/> Marked for Review</div>
        </div>
      </CardContent>
       <CardFooter className="mt-auto flex-col items-stretch p-4 gap-2">
            <SubmitExamButton onClick={onSubmitClick} />
        </CardFooter>
    </Card>
  );
};


const ConfirmationDialog = ({
    open,
    onOpenChange,
    onConfirm,
    unansweredCount,
    isSubmitting,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    unansweredCount: number;
    isSubmitting: boolean;
}) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
         <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to end your exam. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
                {unansweredCount > 0 && (
                     <div className="rounded-md border-l-4 border-destructive bg-destructive/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-bold text-destructive">You have unanswered questions!</h4>
                                <p className="text-sm text-muted-foreground">
                                    You have <span className="font-bold">{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</span>. Are you sure you want to submit?
                                </p>
                            </div>
                        </div>
                    </div>
                )}
               <div className="rounded-md border divide-y">
                     <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                            <FileQuestion className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">Total Questions</span>
                        </div>
                        <span className="font-bold text-lg">{mockQuestions.length}</span>
                    </div>
                     <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                             <CheckSquare className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">Answered</span>
                        </div>
                        <span className="font-semibold text-lg">{mockQuestions.length - unansweredCount}</span>
                    </div>
                     <div className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">Unanswered</span>
                        </div>
                        <span className="font-semibold text-lg">{unansweredCount}</span>
                    </div>
                </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Return to Exam</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                  {isSubmitting ? "Submitting..." : "Yes, Submit Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>,
        document.body
    );
};


export const ExamSession = ({
  examId,
  onTerminate,
  onSuccessfulSubmit,
}: {
  examId: string;
  onTerminate: (reason: string) => void;
  onSuccessfulSubmit: (details: SubmissionDetails) => void;
}) => {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { answers, setAnswers, markedForReview, setMarkedForReview, timeLeft, setTimeLeft } = useExamState(examId);

  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    const details: SubmissionDetails = {
        totalQuestions: questions.length,
        attempted: Object.keys(answers).length,
        unattempted: questions.length - Object.keys(answers).length,
        submissionTime: new Date(),
    };
    
    localStorage.removeItem(`examState-${examId}-answers`);
    localStorage.removeItem(`examState-${examId}-markedForReview`);
    localStorage.removeItem(`examState-${examId}-timeLeft`);

    onSuccessfulSubmit(details);
    setIsSubmitting(false);
    setSubmitDialogOpen(false);
  }, [questions, answers, onSuccessfulSubmit, examId]);
  
  const terminateExam = useCallback((reason: string) => {
    onTerminate(reason);
  }, [onTerminate]);

  const addLog = useCallback((log: Omit<ActivityLog, 'timestamp'>) => {
    const newLog = { ...log, timestamp: new Date().toISOString() };
    setLogs((prev) => [...prev, newLog]);
    console.log('Activity Log:', newLog);
  }, []);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addLog({ type: 'focus', event: 'Exited fullscreen' });
        terminateExam('You have exited fullscreen mode. The exam has been terminated to ensure security.');
      }
    };
    const handleVisibilityChange = () => { if (document.hidden) addLog({ type: 'focus', event: 'Tab hidden' }); };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    let stream: MediaStream;
    const setupWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(err);
        terminateExam('Webcam access is required and was not available.');
      }
    };
    setupWebcam();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [addLog, terminateExam]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      terminateExam("Time's up! Your exam has been automatically submitted.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinalSubmit, terminateExam, setTimeLeft]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleMarkForReview = () => {
    const questionId = questions[currentQuestionIndex].id;
    setMarkedForReview(prev => ({...prev, [questionId]: !prev[questionId]}));
  }

  const goToNext = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  const goToPrevious = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));

  const currentQuestion = questions[currentQuestionIndex];
  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <>
      <ConfirmationDialog
        open={isSubmitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onConfirm={handleFinalSubmit}
        unansweredCount={unansweredCount}
        isSubmitting={isSubmitting}
      />
      <div className="flex h-screen flex-col bg-muted/40">
          <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
              <h1 className="text-lg font-bold">Exam: {examId}</h1>
              <TimeTracker timeLeft={timeLeft} duration={EXAM_DURATION_SECONDS} />
          </header>
          <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-y-auto">
              {/* Main Content */}
              <div className="lg:col-span-3">
                  <Card className="h-full flex flex-col">
                      <CardHeader>
                          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                          <p className="mb-6 text-base">{currentQuestion.text}</p>
                          <RadioGroup 
                              value={answers[currentQuestion.id] || ''}
                              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                          >
                              {currentQuestion.options.map((option, index) => (
                                  <Label key={index} className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                  <RadioGroupItem value={option} id={`q${currentQuestion.id}-opt${index}`} />
                                  <span>{option}</span>
                                  </Label>
                              ))}
                          </RadioGroup>
                      </CardContent>
                      <div className="border-t p-4 flex justify-between items-center">
                          <Button variant="outline" onClick={handleMarkForReview}>
                              <Bookmark className={cn("mr-2 h-4 w-4", markedForReview[currentQuestion.id] && "fill-current")}/>
                              {markedForReview[currentQuestion.id] ? 'Unmark Review' : 'Mark for Review'}
                          </Button>
                          <div className="flex gap-2">
                              <Button variant="outline" onClick={goToPrevious} disabled={currentQuestionIndex === 0}><ChevronLeft className="mr-2 h-4 w-4"/> Previous</Button>
                              <Button onClick={goToNext} disabled={currentQuestionIndex === questions.length - 1}>Next <ChevronRight className="ml-2 h-4 w-4"/></Button>
                          </div>
                      </div>
                  </Card>
              </div>
              
              {/* Navigator */}
              <div className="lg:col-span-1 h-full hidden lg:block">
                  <QuestionNavigator
                      questions={questions}
                      currentQuestionIndex={currentQuestionIndex}
                      answers={answers}
                      markedForReview={markedForReview}
                      onSelectQuestion={setCurrentQuestionIndex}
                      onSubmitClick={() => setSubmitDialogOpen(true)}
                  />
              </div>
          </main>
          <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      </div>
    </>
  );
};
