
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, LogOut, ChevronLeft, ChevronRight, Bookmark, CheckSquare, Square } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

type QuestionStatus = 'unvisited' | 'answered' | 'unanswered' | 'review';

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
}: {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  markedForReview: { [key: string]: boolean };
  onSelectQuestion: (index: number) => void;
}) => {
  const getStatus = (index: number): QuestionStatus => {
    const questionId = questions[index].id;
    if (markedForReview[questionId]) return 'review';
    if (answers[questionId]) return 'answered';
    return 'unanswered';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Question Navigator</CardTitle>
      </CardHeader>
      <CardContent>
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
                                    "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium",
                                    index === currentQuestionIndex && "ring-2 ring-primary ring-offset-2",
                                    status === 'answered' && "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700",
                                    status === 'review' && "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600",
                                    status === 'unanswered' && "bg-muted/50"
                                )}
                            >
                                {index + 1}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Question {index + 1}: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Square className="h-4 w-4 bg-muted/50"/> Unanswered</div>
            <div className="flex items-center gap-2"><CheckSquare className="h-4 w-4 bg-green-100 dark:bg-green-900"/> Answered</div>
            <div className="flex items-center gap-2"><Bookmark className="h-4 w-4 bg-yellow-100 dark:bg-yellow-900"/> Marked for Review</div>
        </div>
      </CardContent>
    </Card>
  );
};


export function ExamSession({ examId }: { examId: string }) {
  // Proctoring State
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Exam State
  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  const terminateExam = useCallback((reason: string) => {
    setTerminationReason(reason);
    setIsTerminated(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const addLog = useCallback((log: Omit<ActivityLog, 'timestamp'>) => {
    const newLog = { ...log, timestamp: new Date().toISOString() };
    setLogs((prev) => [...prev, newLog]);
    console.log('Activity Log:', newLog);
  }, []);
  
  // Proctoring Effects (focus, fullscreen, webcam, etc.)
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

  // Exam Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      terminateExam("Time's up! Your exam has been automatically submitted.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, terminateExam]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleMarkForReview = () => {
    const questionId = questions[currentQuestionIndex].id;
    setMarkedForReview(prev => ({...prev, [questionId]: !prev[questionId]}));
  }

  const goToNext = () => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  const goToPrevious = () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));

  if (isTerminated) {
    return (
      <AlertDialog open={isTerminated}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              {timeLeft <= 0 ? "Time's Up" : "Exam Terminated"}
            </AlertDialogTitle>
            <AlertDialogDescription>{terminationReason}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => (window.location.href = '/dashboard')}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex h-screen flex-col bg-muted/40">
      <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
        <h1 className="text-lg font-bold">Exam: {examId}</h1>
        <div className="flex items-center gap-4">
          <TimeTracker timeLeft={timeLeft} duration={EXAM_DURATION_SECONDS} />
          <AlertDialog>
             <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <LogOut className="mr-2 h-4 w-4" /> Submit Exam
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You cannot make any changes after submitting. Any unanswered questions will be marked as incorrect.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => terminateExam('You have successfully submitted your exam.')}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            />
        </div>
      </main>
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

    