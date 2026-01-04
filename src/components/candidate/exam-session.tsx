'use client';

import { useEffect, useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, LogOut } from 'lucide-react';

type ActivityLog = {
  type: 'focus' | 'activity' | 'snapshot';
  event: string;
  timestamp: string;
};

export function ExamSession({ examId }: { examId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [snapshots, setSnapshots] =useState<string[]>([]);
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const terminateExam = (reason: string) => {
    setTerminationReason(reason);
    setIsTerminated(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const addLog = (log: Omit<ActivityLog, 'timestamp'>) => {
    setLogs((prev) => [
      ...prev,
      { ...log, timestamp: new Date().toISOString() },
    ]);
  };
  
  // Effect for monitoring fullscreen, focus, and activity
  useEffect(() => {
    // Fullscreen monitoring
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addLog({ type: 'focus', event: 'Exited fullscreen' });
        terminateExam(
          'You have exited fullscreen mode. The exam has been terminated to ensure security.'
        );
      }
    };

    // Focus tracking
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addLog({ type: 'focus', event: 'Tab hidden' });
      }
    };

    // Activity tracking
    const handleKeyPress = (e: KeyboardEvent) => {
      addLog({ type: 'activity', event: `Key pressed: ${e.key}` });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Effect for webcam stream and snapshots
  useEffect(() => {
    let stream: MediaStream;
    let snapshotInterval: NodeJS.Timeout;
    
    const setupWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        snapshotInterval = setInterval(() => {
          if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg');
              setSnapshots((prev) => [...prev, dataUrl]);
              addLog({ type: 'snapshot', event: 'Snapshot captured' });
            }
          }
        }, 30000); // every 30 seconds
      } catch (err) {
        console.error(err);
        terminateExam('Webcam access was lost during the exam.');
      }
    };
    
    setupWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(snapshotInterval);
    };
  }, []);

  // Effect for exam progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 100 / 120; // 2 minute exam for demo
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  if (isTerminated) {
    return (
      <AlertDialog open={isTerminated}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Exam Terminated
            </AlertDialogTitle>
            <AlertDialogDescription>
              {terminationReason} Your session has been flagged and the administrator has been notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => (window.location.href = '/candidate/dashboard')}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <h1 className="text-lg font-bold">Exam: {examId}</h1>
        <div className="flex items-center gap-4">
          <div className="w-48">
             <Progress value={progress} />
          </div>
          <Button variant="destructive" size="sm" onClick={() => terminateExam('You voluntarily ended the exam.')}>
            <LogOut className="mr-2 h-4 w-4" /> End Exam
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Question 1 of 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is a placeholder for an exam question. Please answer to the best of your ability. All proctoring features are active.
            </p>
          </CardContent>
        </Card>
      </main>
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
