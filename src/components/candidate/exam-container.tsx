'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { ExamSession, type SubmissionDetails } from '@/components/candidate/exam-session';

export function ExamContainer({
  examId,
  onTerminate,
  onSuccessfulSubmit,
}: {
  examId: string;
  onTerminate: (reason: string) => void;
  onSuccessfulSubmit: (details: SubmissionDetails) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const enterFullscreen = async () => {
        if (containerRef.current) {
            try {
                await containerRef.current.requestFullscreen();
            } catch (err) {
                console.error('Could not enter fullscreen mode:', err);
                onTerminate('Fullscreen mode is required to start the exam. Please allow it and try again.');
            }
        }
    }
    enterFullscreen();
  }, [onTerminate]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background text-foreground"
    >
      <ExamSession
        examId={examId}
        onTerminate={onTerminate}
        onSuccessfulSubmit={onSuccessfulSubmit}
      />
    </div>
  );
}
