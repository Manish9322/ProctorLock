'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Camera, Mic, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PreCheckCard({ examId }: { examId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamStatus, setWebcamStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [micStatus, setMicStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);

  const startChecks = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Webcam check
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamStatus('success');
      } else {
        throw new Error('Video element not found.');
      }
      
      // Mic check
      if (stream.getAudioTracks().length > 0) {
        setMicStatus('success');
      } else {
        setMicStatus('error');
        throw new Error('No audio tracks found.');
      }
      
    } catch (err) {
      console.error('Error accessing media devices.', err);
      let message = 'An unknown error occurred.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          message = 'Permission to access webcam and microphone was denied. Please allow access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          message = 'No webcam or microphone was found. Please ensure they are connected and enabled.';
        } else {
          message = err.message;
        }
      }
      setError(message);
      setWebcamStatus('error');
      setMicStatus('error');
      toast({
        variant: 'destructive',
        title: 'Hardware Check Failed',
        description: message,
      });
    }
  };

  const allChecksPassed = webcamStatus === 'success' && micStatus === 'success';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">System Pre-Check</CardTitle>
        <CardDescription>
          We need to verify your webcam and microphone are working before you
          can start the exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center p-4 border rounded-md bg-muted aspect-video overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          ></video>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-md flex items-center gap-4 border ${webcamStatus === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-muted'}`}>
                <Camera className="h-6 w-6"/>
                <div>
                    <h3 className="font-semibold">Webcam</h3>
                    <p className="text-sm text-muted-foreground">
                        {webcamStatus === 'pending' && 'Waiting...'}
                        {webcamStatus === 'success' && 'Ready'}
                        {webcamStatus === 'error' && 'Not detected'}
                    </p>
                </div>
                {webcamStatus === 'success' && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600"/>}
                {webcamStatus === 'error' && <XCircle className="ml-auto h-5 w-5 text-destructive"/>}
            </div>
             <div className={`p-4 rounded-md flex items-center gap-4 border ${micStatus === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-muted'}`}>
                <Mic className="h-6 w-6"/>
                <div>
                    <h3 className="font-semibold">Microphone</h3>
                    <p className="text-sm text-muted-foreground">
                        {micStatus === 'pending' && 'Waiting...'}
                        {micStatus === 'success' && 'Ready'}
                        {micStatus === 'error' && 'Not detected'}
                    </p>
                </div>
                {micStatus === 'success' && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600"/>}
                {micStatus === 'error' && <XCircle className="ml-auto h-5 w-5 text-destructive"/>}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {(webcamStatus === 'pending' || micStatus === 'pending') && (
             <Button onClick={startChecks}>Start Checks</Button>
        )}
        {webcamStatus === 'error' || micStatus === 'error' ? (
             <Button onClick={startChecks}>Retry Checks</Button>
        ) : null}
        <Button
          onClick={() => router.push(`/candidate/exam/${examId}`)}
          disabled={!allChecksPassed}
        >
          Proceed to Exam
        </Button>
      </CardFooter>
    </Card>
  );
}
