import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { AlertTriangle, Keyboard, Camera } from 'lucide-react';

const activityLogs = [
    { type: 'focus', event: 'Tab hidden', timestamp: '10:15:32 AM' },
    { type: 'activity', event: 'Pasted content', timestamp: '10:15:40 AM' },
    { type: 'snapshot', event: 'Snapshot captured', timestamp: '10:16:00 AM' },
    { type: 'focus', event: 'Exited fullscreen', timestamp: '10:18:05 AM', flagged: true },
];

export default function CandidateMonitoringPage({
  params,
}: {
  params: { candidateId: string };
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Monitoring: Bob Williams ({params.candidateId})
        </h1>
        <Badge variant="destructive">Flagged</Badge>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Activity & Focus Alerts</CardTitle>
                    <CardDescription>Review of potentially suspicious activities during the exam.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {activityLogs.map((log, index) => (
                             <li key={index} className="flex items-start gap-3 text-sm">
                                <div className="flex-shrink-0">
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${log.flagged ? 'bg-destructive/10' : 'bg-muted'}`}>
                                        {log.type === 'focus' && <AlertTriangle className={`h-4 w-4 ${log.flagged ? 'text-destructive' : 'text-muted-foreground'}`}/>}
                                        {log.type === 'activity' && <Keyboard className="h-4 w-4 text-muted-foreground"/>}
                                        {log.type === 'snapshot' && <Camera className="h-4 w-4 text-muted-foreground"/>}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${log.flagged ? 'text-destructive' : ''}`}>{log.event}</p>
                                    <p className="text-muted-foreground">{log.timestamp}</p>
                                </div>
                             </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" /> Webcam Snapshots</CardTitle>
                    <CardDescription>Periodic snapshots from the candidate's webcam.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                {placeholderImages.map((img) => (
                    <div key={img.id} className="aspect-video overflow-hidden rounded-md border">
                        <Image
                            src={img.imageUrl}
                            alt={img.description}
                            width={320}
                            height={240}
                            data-ai-hint={img.imageHint}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
