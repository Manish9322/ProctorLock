'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  FileText,
  Clock,
  ClipboardList,
  Shield,
  Star,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  PlusCircle,
  Trash2,
  Edit,
  Video,
  MousePointer,
  CopySlash,
  Eye,
  BookCopy,
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useCreateTestMutation } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'details', name: 'Test Details', icon: FileText },
  { id: 'scheduling', name: 'Scheduling', icon: Clock },
  { id: 'questions', name: 'Questions', icon: ClipboardList },
  { id: 'rules', name: 'Rules & Proctoring', icon: Shield },
  { id: 'review', name: 'Review & Publish', icon: Star },
];

export type Question = {
  _id: string;
  id: string;
  type: 'mcq' | 'descriptive';
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  negativeMarks?: number;
};

// Form State Types
type TestDetails = {
  title: string;
  description: string;
};

type TestScheduling = {
  date: Date | undefined;
  startTime: string;
  endTime: string;
  duration: number;
};

type TestQuestions = {
    mcqCount: number;
    descriptiveCount: number;
    totalMarks: number;
}

type TestRules = {
  fullscreen: boolean;
  focusHandling: string;
  requireWebcam: boolean;
  requireMic: boolean;
  snapshotInterval: string;
  disableCopyPaste: boolean;
  disableRightClick: boolean;
};

export function CreateTestForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const [createTest, { isLoading: isCreatingTest }] = useCreateTestMutation();

  // State lifted from child components
  const [testDetails, setTestDetails] = useState<TestDetails>({
    title: 'Mid-Term Exam for CS-101',
    description: 'A brief description of the test, its purpose, and instructions for candidates.',
  });
  const [testScheduling, setTestScheduling] = useState<TestScheduling>({
    date: new Date(),
    startTime: '09:00',
    endTime: '17:00',
    duration: 60,
  });
  const [testQuestions, setTestQuestions] = useState<TestQuestions>({
    mcqCount: 10,
    descriptiveCount: 2,
    totalMarks: 20, // 10*1 + 2*5
  });
  const [testRules, setTestRules] = useState<TestRules>({
    fullscreen: true,
    focusHandling: 'warn_terminate',
    requireWebcam: true,
    requireMic: true,
    snapshotInterval: '30s',
    disableCopyPaste: true,
    disableRightClick: false,
  });
  
  const allState = { testDetails, testScheduling, testQuestions, testRules };

  const handlePublish = async () => {
    const finalTestData = {
        title: testDetails.title,
        description: testDetails.description,
        marks: testQuestions.totalMarks,
        createdBy: 'examiner@example.com', // This should be dynamic in a real app
        scheduling: {
            date: testScheduling.date ? format(testScheduling.date, 'yyyy-MM-dd') : '',
            startTime: testScheduling.startTime,
            endTime: testScheduling.endTime,
            duration: testScheduling.duration,
        },
        questions: {
            mcqCount: testQuestions.mcqCount,
            descriptiveCount: testQuestions.descriptiveCount,
        },
        rules: {
            ...testRules
        }
    };

    try {
        await createTest(finalTestData).unwrap();
        toast({
            title: "Test Submitted",
            description: "Your test has been sent for approval.",
        });
        router.push('/examiner/tests');
    } catch (err: any) {
        toast({
            variant: "destructive",
            title: "Failed to Submit Test",
            description: err.data?.message || "An unexpected error occurred.",
        });
    }
  }


  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
        setCurrentStep(index);
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'details':
        return <TestDetailsStep details={testDetails} setDetails={setTestDetails} />;
      case 'scheduling':
        return <TestSchedulingStep scheduling={testScheduling} setScheduling={setTestScheduling} />;
      case 'questions':
        return <TestQuestionsStep questions={testQuestions} setQuestions={setTestQuestions} />;
      case 'rules':
        return <TestRulesStep rules={testRules} setRules={setTestRules} />;
      case 'review':
        return <TestReviewStep allState={allState} onEdit={goToStep}/>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="col-span-1">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center cursor-pointer" onClick={() => goToStep(index)}>
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : 'border bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-medium">{step.name}</h4>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="col-span-1 md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].name}</CardTitle>
            <CardDescription>
              {
                {
                  details: 'Provide basic information for your test.',
                  scheduling: 'Set up the date, time, and duration.',
                  questions: 'Define the number of questions to be randomly selected from the question bank.',
                  rules: 'Define the proctoring rules and security settings.',
                  review: 'Review all settings before submitting the test for approval.',
                }[steps[currentStep].id]
              }
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={goToNextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                  <Button variant="secondary" disabled={isCreatingTest}>Save as Draft</Button>
                  <Button onClick={handlePublish} disabled={isCreatingTest}>
                    {isCreatingTest ? 'Submitting...' : 'Submit for Approval'}
                  </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function TestDetailsStep({ details, setDetails }: { details: TestDetails, setDetails: React.Dispatch<React.SetStateAction<TestDetails>>}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-name">Test Name</Label>
        <Input id="test-name" value={details.title} onChange={(e) => setDetails(prev => ({...prev, title: e.target.value}))} placeholder="e.g., Mid-Term Exam for CS-101" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="test-description">Description</Label>
        <Textarea
          id="test-description"
          value={details.description}
          onChange={(e) => setDetails(prev => ({...prev, description: e.target.value}))}
          placeholder="Provide a brief description of the test, its purpose, and instructions for candidates."
          rows={4}
        />
      </div>
    </div>
  );
}

function DatePicker({
  date,
  setDate,
}: {
  date?: Date;
  setDate: (date?: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TestSchedulingStep({ scheduling, setScheduling }: { scheduling: TestScheduling, setScheduling: React.Dispatch<React.SetStateAction<TestScheduling>>}) {
    const handleDateChange = (date?: Date) => {
        setScheduling(prev => ({ ...prev, date }));
    }

    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        setScheduling(prev => ({ ...prev, [field]: value }));
    }
    
    const handleNumberChange = (field: 'duration', value: string) => {
        setScheduling(prev => ({...prev, [field]: parseInt(value) || 0 }))
    }

  return (
    <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="exam-date">Exam Date</Label>
          <DatePicker date={scheduling.date} setDate={handleDateChange} />
        </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input id="start-time" type="time" value={scheduling.startTime} onChange={(e) => handleTimeChange('startTime', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input id="end-time" type="time" value={scheduling.endTime} onChange={(e) => handleTimeChange('endTime', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" value={scheduling.duration} onChange={e => handleNumberChange('duration', e.target.value)} placeholder="e.g., 60" />
        </div>
      </div>
    </div>
  );
}

export function QuestionDialog({
  question,
  onSave,
  children,
}: {
  question?: Question;
  onSave: (question: Omit<Question, '_id' | 'id'>) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'mcq' | 'descriptive'>(
    question?.type || 'mcq'
  );
  const [text, setText] = useState(question?.text || '');
  const [marks, setMarks] = useState(question?.marks || 1);
  const [negativeMarks, setNegativeMarks] = useState(
    question?.negativeMarks || 0
  );
  const [options, setOptions] = useState(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(
    question?.correctAnswer || ''
  );
  
  React.useEffect(() => {
    if(open) {
        setType(question?.type || 'mcq');
        setText(question?.text || '');
        setMarks(question?.marks || 1);
        setNegativeMarks(question?.negativeMarks || 0);
        setOptions(question?.options || ['', '', '', '']);
        setCorrectAnswer(question?.correctAnswer || '');
    }
  }, [open, question])

  const handleSave = () => {
    const newQuestion: Omit<Question, '_id' | 'id'> = {
      type,
      text,
      marks,
      negativeMarks,
      options: type === 'mcq' ? options.filter(opt => opt.trim() !== '') : undefined,
      correctAnswer: type === 'mcq' ? correctAnswer : undefined,
    };
    onSave(newQuestion);
    setOpen(false);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {question ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription>
            Configure the question details, type, and scoring.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as 'mcq' | 'descriptive')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice Question</SelectItem>
                <SelectItem value="descriptive">Descriptive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the question here..."
            />
          </div>
          {type === 'mcq' && (
            <div className="space-y-4 rounded-md border p-4">
              <Label>Options</Label>
               <RadioGroup
                    value={correctAnswer}
                    onValueChange={setCorrectAnswer}
                    className="space-y-2"
                >
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                        <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                        />
                        <div className="flex items-center space-x-2">
                             <Checkbox
                                id={`correct-${index}`}
                                checked={correctAnswer === option && option !== ''}
                                onCheckedChange={() => setCorrectAnswer(option)}
                            />
                            <Label htmlFor={`correct-${index}`}>Correct</Label>
                        </div>
                        </div>
                    ))}
              </RadioGroup>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="negative-marks">Negative Marks (optional)</Label>
              <Input
                id="negative-marks"
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TestQuestionsStep({ questions, setQuestions }: { questions: TestQuestions, setQuestions: React.Dispatch<React.SetStateAction<TestQuestions>>}) {
    
    const handleCountChange = (field: 'mcqCount' | 'descriptiveCount', value: string) => {
        const count = parseInt(value) || 0;
        setQuestions(prev => {
            const newCounts = {...prev, [field]: count };
            const newTotalMarks = (newCounts.mcqCount * 1) + (newCounts.descriptiveCount * 5);
            return { ...newCounts, totalMarks: newTotalMarks };
        });
    }

    return (
        <div className="space-y-6">
            <Alert>
                <BookCopy className="h-4 w-4" />
                <AlertTitle>Question Bank Integration</AlertTitle>
                <AlertDescription>
                    Questions will be randomly selected from the central Question Bank. Please specify the number of questions for each type and total marks for the test.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="mcq-count">Number of MCQs</Label>
                    <Input 
                        id="mcq-count"
                        type="number" 
                        value={questions.mcqCount} 
                        onChange={e => handleCountChange('mcqCount', e.target.value)}
                        placeholder="e.g., 20" 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="descriptive-count">Number of Descriptive Questions</Label>
                    <Input 
                        id="descriptive-count"
                        type="number" 
                        value={questions.descriptiveCount} 
                        onChange={e => handleCountChange('descriptiveCount', e.target.value)}
                        placeholder="e.g., 5" 
                    />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="total-marks">Total Marks</Label>
                    <Input 
                        id="total-marks"
                        type="number" 
                        value={questions.totalMarks} 
                        onChange={e => setQuestions(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 0 }))}
                        placeholder="e.g., 100" 
                    />
                     <p className="text-xs text-muted-foreground">Calculated: {questions.mcqCount * 1 + questions.descriptiveCount * 5} (1 mark/MCQ, 5 marks/Desc)</p>
                </div>
            </div>
            <div className="pt-2">
                <p className="font-medium">Total Questions: <span className="text-primary">{questions.mcqCount + questions.descriptiveCount}</span></p>
            </div>
        </div>
    );
}

function TestRulesStep({ rules, setRules }: { rules: TestRules, setRules: React.Dispatch<React.SetStateAction<TestRules>>}) {
  return (
     <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5" /> Session Control</CardTitle>
          <CardDescription>Rules that control the candidate's environment during the exam.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label htmlFor="fullscreen-mode" className="font-semibold">Mandatory Fullscreen</Label>
              <p className="text-xs text-muted-foreground">Force candidates to stay in fullscreen mode throughout the exam.</p>
            </div>
            <Switch id="fullscreen-mode" checked={rules.fullscreen} onCheckedChange={(checked) => setRules(prev => ({...prev, fullscreen: checked}))} />
          </div>
          <div className="space-y-2 rounded-md border p-4">
            <Label className="font-semibold">Focus &amp; Tab Switch Handling</Label>
            <p className="text-xs text-muted-foreground">Define the action to take if a candidate switches tabs or loses focus.</p>
            <Select value={rules.focusHandling} onValueChange={(value) => setRules(prev => ({...prev, focusHandling: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warn">Issue a warning only</SelectItem>
                <SelectItem value="warn_terminate">Warn, then terminate after 3 violations</SelectItem>
                <SelectItem value="terminate">Terminate session immediately</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Video className="h-5 w-5" /> Monitoring</CardTitle>
          <CardDescription>Settings related to proctoring and activity monitoring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label htmlFor="webcam-required" className="font-semibold">Require Webcam</Label>
              <p className="text-xs text-muted-foreground">Candidates must have a functional webcam to start the exam.</p>
            </div>
            <Switch id="webcam-required" checked={rules.requireWebcam} onCheckedChange={(checked) => setRules(prev => ({...prev, requireWebcam: checked}))} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label htmlFor="mic-required" className="font-semibold">Require Microphone</Label>
              <p className="text-xs text-muted-foreground">Candidates must have a functional microphone to start the exam.</p>
            </div>
            <Switch id="mic-required" checked={rules.requireMic} onCheckedChange={(checked) => setRules(prev => ({...prev, requireMic: checked}))} />
          </div>
           <div className="space-y-2 rounded-md border p-4">
            <Label className="font-semibold">Webcam Snapshot Interval</Label>
            <p className="text-xs text-muted-foreground">How often to capture webcam snapshots for review.</p>
            <Select value={rules.snapshotInterval} onValueChange={(value) => setRules(prev => ({...prev, snapshotInterval: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15s">Every 15 seconds</SelectItem>
                <SelectItem value="30s">Every 30 seconds</SelectItem>
                <SelectItem value="1m">Every 1 minute</SelectItem>
                <SelectItem value="5m">Every 5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><CopySlash className="h-5 w-5" /> Content Security</CardTitle>
          <CardDescription>Prevent candidates from using unauthorized aids or copying content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-2 rounded-md border p-4">
            <Checkbox id="disable-copy-paste" checked={rules.disableCopyPaste} onCheckedChange={(checked) => setRules(prev => ({...prev, disableCopyPaste: checked as boolean}))} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="disable-copy-paste"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Disable Copy &amp; Paste
              </label>
              <p className="text-xs text-muted-foreground">
                Block clipboard actions during the exam.
              </p>
            </div>
          </div>
           <div className="flex items-center space-x-2 rounded-md border p-4">
            <Checkbox id="disable-right-click" checked={rules.disableRightClick} onCheckedChange={(checked) => setRules(prev => ({...prev, disableRightClick: checked as boolean}))} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="disable-right-click"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Disable Right-Click
              </label>
              <p className="text-xs text-muted-foreground">
                Prevent access to the browser's context menu.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewItem({ label, value, onEdit }: {label: string, value: React.ReactNode, onEdit?: () => void}) {
    return (
        <div className="flex justify-between items-start py-2">
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
            {onEdit && <Button variant="link" size="sm" onClick={onEdit}>Edit</Button>}
        </div>
    )
}

function TestReviewStep({ allState, onEdit }: { allState: Record<string, any>, onEdit: (index: number) => void}) {
    const { testDetails, testScheduling, testQuestions, testRules } = allState;

    const totalQuestions = testQuestions.mcqCount + testQuestions.descriptiveCount;

    const isReadyForPublish = testDetails.title && totalQuestions > 0 && testQuestions.totalMarks > 0;

    return (
        <div className="space-y-8">
            {!isReadyForPublish && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertTitle>Cannot Submit for Approval</AlertTitle>
                    <AlertDescription>
                        The test is missing required information. Please ensure the following are complete:
                        <ul className="list-disc pl-5 mt-2">
                            {!testDetails.title && <li>Test Title</li>}
                            {totalQuestions === 0 && <li>Number of questions must be greater than zero</li>}
                            {testQuestions.totalMarks === 0 && <li>Total marks must be greater than zero</li>}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><FileText className="h-5 w-5"/>Test Details</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => onEdit(0)}>Edit</Button>
                </CardHeader>
                <CardContent className="divide-y">
                     <ReviewItem label="Test Title" value={testDetails.title} />
                     <ReviewItem label="Test Description" value={testDetails.description} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Clock className="h-5 w-5"/>Scheduling</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => onEdit(1)}>Edit</Button>
                </CardHeader>
                <CardContent className="divide-y">
                     <ReviewItem label="Exam Date" value={testScheduling.date ? format(testScheduling.date, 'PPP') : 'Not set'} />
                     <ReviewItem label="Time Window" value={`${testScheduling.startTime} - ${testScheduling.endTime}`} />
                     <ReviewItem label="Duration" value={`${testScheduling.duration} minutes`} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-5 w-5"/>Questions</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => onEdit(2)}>Edit</Button>
                </CardHeader>
                <CardContent className="divide-y">
                     <ReviewItem label="MCQs" value={`${testQuestions.mcqCount}`} />
                     <ReviewItem label="Descriptive Questions" value={`${testQuestions.descriptiveCount}`} />
                     <ReviewItem label="Total Questions" value={totalQuestions} />
                     <ReviewItem label="Total Marks" value={testQuestions.totalMarks} />
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5"/>Rules &amp; Proctoring</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => onEdit(3)}>Edit</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <ReviewItem label="Mandatory Fullscreen" value={testRules.fullscreen ? 'Enabled' : 'Disabled'} />
                    <ReviewItem label="Require Webcam" value={testRules.requireWebcam ? 'Enabled' : 'Disabled'} />
                    <ReviewItem label="Require Microphone" value={testRules.requireMic ? 'Enabled' : 'Disabled'} />
                    <ReviewItem label="Disable Copy/Paste" value={testRules.disableCopyPaste ? 'Enabled' : 'Disabled'} />
                    <ReviewItem label="Disable Right-Click" value={testRules.disableRightClick ? 'Enabled' : 'Disabled'} />
                    <ReviewItem label="Snapshot Interval" value={testRules.snapshotInterval} />
                    <ReviewItem label="Focus Loss Handling" value={testRules.focusHandling} />
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                 <Button variant="ghost"><Eye className="mr-2 h-4 w-4"/>Preview as Candidate</Button>
            </div>
        </div>
    )
}
