'use client';
import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ExamSession } from '@/components/candidate/exam-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, ShieldCheck, Video } from 'lucide-react';

export default function ExamPage() {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const examId = params.id as string;

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

  if (!examId) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background text-foreground"
    >
      {isExamStarted ? (
        <ExamSession examId={examId} />
      ) : (
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
      )}
    </div>
  );
}
