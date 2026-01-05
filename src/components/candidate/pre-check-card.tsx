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
import { CheckCircle2, XCircle, Camera, Mic, AlertTriangle, Signal, CheckSquare } from 'lucide-react';
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

const CheckItem = ({
    icon: Icon,
    title,
    status,
    children,
    className,
}:{
    icon: React.ElementType;
    title: string;
    status: 'pending' | 'success' | 'error';
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(
            `p-4 rounded-md flex items-center gap-4 border`,
            status === 'success' ? 'border-green-200 dark:border-green-800' : status === 'error' ? 'border-destructive/50' : '',
            className
        )}>
            <Icon className="h-6 w-6"/>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <div className="text-sm text-muted-foreground">
                   {children}
                </div>
            </div>
            {status === 'success' && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600"/>}
            {status === 'error' && <XCircle className="ml-auto h-5 w-5 text-destructive"/>}
        </div>
    )
}

export function PreCheckCard({ examId }: { examId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [webcamStatus, setWebcamStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [micStatus, setMicStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [networkStatus, setNetworkStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);

  const [consentGiven, setConsentGiven] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNetworkStatus = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection && connection.downlink) {
        setDownloadSpeed(connection.downlink);
        if (connection.downlink >= 1) { // 1 Mbps threshold
            setNetworkStatus('success');
        } else {
            setNetworkStatus('error');
            throw new Error('Your network speed is too slow for a stable exam experience. Please find a better connection.');
        }
    } else {
        setNetworkStatus('success');
        toast({
            title: 'Network Check',
            description: 'Could not automatically determine network speed. Please ensure you have a stable connection.',
        });
    }
  }

  const startChecks = async () => {
    setIsChecking(true);
    setError(null);
    setWebcamStatus('pending');
    setMicStatus('pending');
    setNetworkStatus('pending');
    setDownloadSpeed(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamStatus('success');
      } else {
        throw new Error('Video element not found.');
      }
      
      if (stream.getAudioTracks().length > 0) {
        setMicStatus('success');
      } else {
        setMicStatus('error');
        throw new Error('No audio tracks found.');
      }
      
      checkNetworkStatus();
      
    } catch (err) {
      console.error('Error during system checks.', err);
      let message = 'An unknown error occurred.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          message = 'Permission to access webcam and microphone was denied. Please allow access in your browser settings.';
           setWebcamStatus('error');
           setMicStatus('error');
           setNetworkStatus('error');
        } else if (err.name === 'NotFoundError') {
          message = 'No webcam or microphone was found. Please ensure they are connected and enabled.';
          setWebcamStatus('error');
          setMicStatus('error');
        } else {
          message = err.message;
        }
      }
      setError(message);
      toast({
        variant: 'destructive',
        title: 'System Check Failed',
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
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const initialSnapshot = canvas.toDataURL('image/jpeg');
            console.log("Initial snapshot captured.");
        }
    }

    const metadata = getSessionMetadata();
    console.log("Session metadata generated:", metadata);
    router.push(`/exam/${examId}`);
  }


  const allChecksPassed = webcamStatus === 'success' && micStatus === 'success' && networkStatus === 'success' && consentGiven;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="text-2xl">Pre-Test Verification</CardTitle>
        <CardDescription>
          Final checks before you can begin your exam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left Column - Camera */}
            <div className="lg:col-span-3">
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
            </div>

            {/* Right Column - Checks */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <CheckItem icon={Camera} title="Webcam" status={webcamStatus} className="flex-grow">
                    {webcamStatus === 'pending' && 'Waiting...'}
                    {webcamStatus === 'success' && 'Ready'}
                    {webcamStatus === 'error' && 'Not detected'}
                </CheckItem>
                <CheckItem icon={Mic} title="Microphone" status={micStatus} className="flex-grow">
                    {micStatus === 'pending' && 'Waiting...'}
                    {micStatus === 'success' && 'Ready'}
                    {micStatus === 'error' && 'Not detected'}
                </CheckItem>
                 <CheckItem icon={Signal} title="Network & Speed" status={networkStatus} className="flex-grow">
                    {networkStatus === 'pending' && 'Waiting...'}
                    {networkStatus === 'success' && `Connection is stable ${downloadSpeed ? `(${downloadSpeed.toFixed(2)} Mbps)`: ''}`}
                    {networkStatus === 'error' && `Connection is unstable ${downloadSpeed ? `(${downloadSpeed.toFixed(2)} Mbps)`: ''}`}
                </CheckItem>
            </div>
            
            {/* Bottom Row - Consent & Actions */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                 <div className={`p-4 rounded-md flex items-start gap-4 border ${consentGiven ? 'border-green-200 dark:border-green-800' : ''}`}>
                    <CheckSquare className="h-6 w-6 mt-1 flex-shrink-0"/>
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">Consent for Proctoring</h3>
                        <p className="text-sm text-muted-foreground">
                            I agree to be monitored via webcam, microphone, and screen activity for proctoring purposes.
                        </p>
                         <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="consent" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(checked as boolean)} />
                            <Label htmlFor="consent" className="text-sm font-medium leading-none">I agree to the terms</Label>
                        </div>
                    </div>
                    {consentGiven && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0"/>}
                </div>

                <div className="p-4 rounded-md border flex flex-col justify-between">
                     {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 w-full mt-auto flex-grow">
                        {webcamStatus === 'pending' || micStatus === 'pending' || networkStatus === 'pending' ? (
                            <Button onClick={startChecks} disabled={isChecking} className="w-full sm:w-auto flex-grow">
                                {isChecking ? 'Checking...' : 'Start System Check'}
                            </Button>
                        ) : null}
                        {webcamStatus === 'error' || micStatus === 'error' || networkStatus === 'error' ? (
                            <Button onClick={startChecks} disabled={isChecking} className="w-full sm:w-auto flex-grow">
                                {isChecking ? 'Retrying...' : 'Retry Checks'}
                            </Button>
                        ) : null}
                        <Button
                            onClick={handleProceed}
                            disabled={!allChecksPassed || isChecking}
                            className="w-full sm:w-auto flex-grow"
                        >
                            Proceed to Exam
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
