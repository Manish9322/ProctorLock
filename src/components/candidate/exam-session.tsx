'use client';

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Bookmark, CheckSquare, Square } from 'lucide-react';
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
  onNavigateToConfirm,
}: {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  markedForReview: { [key: string]: boolean };
  onSelectQuestion: (index: number) => void;
  onNavigateToConfirm: () => void;
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
            <SubmitExamButton
                unansweredQuestionsCount={unansweredQuestionsCount}
                onNavigateToConfirm={onNavigateToConfirm}
            />
        </CardFooter>
    </Card>
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  const handleFinalSubmit = useCallback(async () => {
    // This function will be called from the confirmation page
    const details: SubmissionDetails = {
        totalQuestions: questions.length,
        attempted: Object.keys(answers).length,
        unattempted: questions.length - Object.keys(answers).length,
        submissionTime: new Date(),
    };
    onSuccessfulSubmit(details);
  }, [questions, answers, onSuccessfulSubmit]);

  const handleNavigateToConfirm = () => {
    // Save current state to localStorage so the confirm page can read it
    const examState = {
        answers,
        markedForReview,
        timeLeft,
        totalQuestions: questions.length,
    };
    localStorage.setItem(`examState-${examId}`, JSON.stringify(examState));
    router.push(`/exam/${examId}/confirm`);
  };
  

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
  }, [timeLeft, handleFinalSubmit, terminateExam]);

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

  return (
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
                    onNavigateToConfirm={handleNavigateToConfirm}
                />
            </div>
        </main>
        <video ref={videoRef} autoPlay muted playsInline className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
