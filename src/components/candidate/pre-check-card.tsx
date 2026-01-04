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
import { CheckCircle2, XCircle, Camera, Mic, AlertTriangle, Info, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

type SessionMetadata = {
    sessionId: string;
    examId: string;
    startTime: string;
    timezone: string;
    browser: string;
    os: string;
    screenResolution: string;
    initialFocusState: 'focused' | 'blurred';
};

export function PreCheckCard({ examId }: { examId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [webcamStatus, setWebcamStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [micStatus, setMicStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChecks = async () => {
    setIsChecking(true);
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
    } finally {
        setIsChecking(false);
    }
  };

  const getSessionMetadata = (): SessionMetadata => {
    const userAgent = window.navigator.userAgent;
    let browser = "Unknown";
    if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (userAgent.indexOf("Edge") > -1) browser = "Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

    const os = window.navigator.platform;

    return {
        sessionId: crypto.randomUUID(),
        examId,
        startTime: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        browser,
        os,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        initialFocusState: document.hasFocus() ? 'focused' : 'blurred',
    }
  }

  const handleProceed = () => {
    // 1. Capture initial snapshot
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const initialSnapshot = canvas.toDataURL('image/jpeg');
            console.log("Initial snapshot captured.");
            // In a real app, you would send this to your backend
        }
    }

    // 2. Generate session metadata
    const metadata = getSessionMetadata();
    console.log("Session metadata generated:", metadata);
    // In a real app, you would store this in your database

    // 3. Redirect to exam
    router.push(`/candidate/exam/${examId}`);
  }


  const allChecksPassed = webcamStatus === 'success' && micStatus === 'success' && consentGiven;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="text-2xl">Pre-Test Verification</CardTitle>
        <CardDescription>
          Final checks before you can begin your exam.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center border rounded-md bg-muted aspect-video overflow-hidden">
                {webcamStatus === 'pending' && <Camera className="h-16 w-16 text-muted-foreground"/>}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`h-full w-full object-cover ${webcamStatus === 'success' ? 'block' : 'hidden'}`}
                ></video>
                {webcamStatus === 'error' && <Camera className="h-16 w-16 text-destructive"/>}
            </div>
             {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
        <div className="flex flex-col space-y-4">
             <Alert className="text-sm">
                <Info className="h-4 w-4" />
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                    Please start the system check and provide consent to proceed.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 gap-4">
                <div className={`p-4 rounded-md flex items-center gap-4 border ${webcamStatus === 'success' ? 'border-green-200 dark:border-green-800' : ''}`}>
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
                 <div className={`p-4 rounded-md flex items-center gap-4 border ${micStatus === 'success' ? 'border-green-200 dark:border-green-800' : ''}`}>
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

            <div className={`p-4 rounded-md flex items-start gap-4 border ${consentGiven ? 'border-green-200 dark:border-green-800' : ''}`}>
                    <CheckSquare className="h-6 w-6 mt-1 flex-shrink-0"/>
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">Consent for Proctoring</h3>
                        <p className="text-sm text-muted-foreground">
                            I agree to be monitored via webcam and microphone for proctoring purposes.
                        </p>
                         <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="consent" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(checked as boolean)} />
                            <Label htmlFor="consent" className="text-sm font-medium leading-none">I agree to the terms</Label>
                        </div>
                    </div>
                    {consentGiven && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0"/>}
            </div>
            
            <div className="flex justify-end gap-2 pt-2 mt-auto">
                 {webcamStatus === 'pending' || micStatus === 'pending' ? (
                    <Button onClick={startChecks} disabled={isChecking}>
                        {isChecking ? 'Checking...' : 'Start System Check'}
                    </Button>
                ) : null}
                {webcamStatus === 'error' || micStatus === 'error' ? (
                    <Button onClick={startChecks} disabled={isChecking}>
                        {isChecking ? 'Checking...' : 'Retry Checks'}
                    </Button>
                ) : null}
                <Button
                onClick={handleProceed}
                disabled={!allChecksPassed}
                >
                Proceed to Exam
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
