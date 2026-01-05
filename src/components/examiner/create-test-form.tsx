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
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const steps = [
  { id: 'details', name: 'Test Details', icon: FileText },
  { id: 'scheduling', name: 'Scheduling', icon: Clock },
  { id: 'questions', name: 'Questions', icon: ClipboardList },
  { id: 'rules', name: 'Rules & Proctoring', icon: Shield },
  { id: 'review', name: 'Review & Publish', icon: Star },
];

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
        return <p>Question configuration will go here.</p>;
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

function DatePicker({ date, setDate }: { date?: Date; setDate: (date?: Date) => void }) {
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
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
          <Label htmlFor="exam-date">Exam Date</Label>
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="space-y-2">
            <Label>Timezone</Label>
            <Input defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input id="start-time" type="time" defaultValue="09:00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input id="end-time" type="time" defaultValue="17:00" />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <CardContent className="text-sm text-muted-foreground space-y-2">
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