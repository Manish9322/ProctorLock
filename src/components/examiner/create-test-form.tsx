'use client';

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

const steps = [
  { id: 'details', name: 'Test Details', icon: FileText },
  { id: 'scheduling', name: 'Scheduling', icon: Clock },
  { id: 'questions', name: 'Questions', icon: ClipboardList },
  { id: 'rules', name: 'Rules & Proctoring', icon: Shield },
  { id: 'review', name: 'Review & Publish', icon: Star },
];

export type Question = {
  id: string;
  type: 'mcq' | 'descriptive';
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  negativeMarks?: number;
};

export function CreateTestForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'details':
        return <TestDetailsStep />;
      case 'scheduling':
        return <TestSchedulingStep />;
      case 'questions':
        return <TestQuestionsStep />;
      case 'rules':
        return <p>Rules and proctoring settings will go here.</p>;
      case 'review':
        return <p>Review and publish will go here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="col-span-1">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : 'border bg-muted text-muted-foreground'
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
                  questions: 'Add and manage the questions for this test.',
                  rules: 'Define the proctoring rules and security settings.',
                  review: 'Review all settings and publish the test.',
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
              <Button>Save & Publish</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function TestDetailsStep() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-name">Test Name</Label>
        <Input id="test-name" placeholder="e.g., Mid-Term Exam for CS-101" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="test-description">Description</Label>
        <Textarea
          id="test-description"
          placeholder="Provide a brief description of the test, its purpose, and instructions for candidates."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="test-id">Test ID / Code</Label>
        <div className="flex items-center gap-2">
          <Input id="test-id" value="CS101-MT-2024" readOnly />
          <Button variant="outline">Generate</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          A unique ID will be automatically generated for this test.
        </p>
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

function TestSchedulingStep() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="exam-date">Exam Date</Label>
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Input
            defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input id="start-time" type="time" defaultValue="09:00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input id="end-time" type="time" defaultValue="17:00" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" placeholder="e.g., 60" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grace-period">Grace Period (minutes)</Label>
          <Input id="grace-period" type="number" placeholder="e.g., 5" />
        </div>
      </div>
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Total Exam Window:</span>
            <span className="font-medium text-foreground">8 hours</span>
          </div>
          <div className="flex justify-between">
            <span>Effective Start Time:</span>
            <span className="font-medium text-foreground">9:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span>Effective End Time:</span>
            <span className="font-medium text-foreground">5:05 PM</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionDialog({
  question,
  onSave,
  children,
}: {
  question?: Question;
  onSave: (question: Question) => void;
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

  const handleSave = () => {
    const newQuestion: Question = {
      id: question?.id || new Date().toISOString(),
      type,
      text,
      marks,
      negativeMarks,
    };
    if (type === 'mcq') {
      newQuestion.options = options.filter(opt => opt.trim() !== '');
      newQuestion.correctAnswer = correctAnswer;
    }
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
        <div className="space-y-4 py-4">
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
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <RadioGroup
                    value={correctAnswer}
                    onValueChange={setCorrectAnswer}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`correct-${index}`}
                        checked={correctAnswer === option}
                        onCheckedChange={() => setCorrectAnswer(option)}
                      />
                      <Label htmlFor={`correct-${index}`}>Correct</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
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

function TestQuestionsStep() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleSaveQuestion = (question: Question) => {
    const existingIndex = questions.findIndex((q) => q.id === question.id);
    if (existingIndex > -1) {
      const updatedQuestions = [...questions];
      updatedQuestions[existingIndex] = question;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, question]);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };
  
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="font-semibold">Questions ({questions.length})</h3>
            <p className="text-sm text-muted-foreground">Total Marks: {totalMarks}</p>
        </div>
        <QuestionDialog onSave={handleSaveQuestion}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </QuestionDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Marks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No questions added yet.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q, index) => (
                <TableRow key={q.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="max-w-sm truncate font-medium">
                    {q.text}
                  </TableCell>
                  <TableCell className="uppercase">{q.type}</TableCell>
                  <TableCell className="text-center">{q.marks}</TableCell>
                  <TableCell className="text-right">
                     <QuestionDialog question={q} onSave={handleSaveQuestion}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                     </QuestionDialog>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
