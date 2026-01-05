
'use client';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  AlertTriangle,
  Keyboard,
  Camera,
  Signal,
  Fullscreen,
  Eye,
  MessageSquare,
  Bookmark,
  ShieldAlert,
  Power,
  Clock,
  User,
  Building,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const candidateDetails = {
  name: 'Bob Williams',
  id: 'user2',
  role: 'Student',
  institute: 'MIT',
  exam: 'MA203-MIDTERM',
  status: 'Flagged',
};

const sessionHealth = {
  connection: 'Stable',
  lastHeartbeat: '2s ago',
  fullscreen: 'Active',
  focus: 'Focused',
  alerts: 8,
};

const activityLogs = [
  {
    type: 'focus',
    event: 'Exited fullscreen',
    timestamp: '10:18:05 AM',
    severity: 'critical',
  },
  {
    type: 'snapshot',
    event: 'Suspicious movement detected',
    timestamp: '10:17:30 AM',
    severity: 'high',
    trigger: 'AI Analysis',
  },
  {
    type: 'snapshot',
    event: 'Periodic snapshot captured',
    timestamp: '10:16:00 AM',
    severity: 'info',
    trigger: 'Periodic',
  },
  { type: 'activity', event: 'Pasted content', timestamp: '10:15:40 AM', severity: 'medium' },
  { type: 'focus', event: 'Tab hidden', timestamp: '10:15:32 AM', severity: 'high' },
];

const alertCounts = {
    fullscreenExit: 1,
    tabSwitch: 2,
    clipboard: 3,
    disconnects: 0,
}

const snapshotData = placeholderImages.map((img, i) => ({
    ...img,
    timestamp: `10:1${i + 5}:0${i * 2} AM`,
    trigger: i % 2 === 0 ? 'Periodic' : 'On Event (Focus Loss)',
}));


export default function CandidateMonitoringPage({
  params,
}: {
  params: { candidateId: string };
}) {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Monitoring: {candidateDetails.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                 <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {candidateDetails.role}</div>
                 <div className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> {candidateDetails.institute}</div>
                 <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {candidateDetails.exam}</div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
             <Badge variant={candidateDetails.status === 'Flagged' ? 'destructive' : 'default'}>
                {candidateDetails.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2"><Signal className="h-4 w-4"/> Session Health</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <span>Last Seen: <span className="font-medium">{sessionHealth.lastHeartbeat}</span></span></div>
                    <div className="flex items-center gap-2"><Signal className="h-4 w-4 text-muted-foreground"/> <span>Network: <span className="font-medium text-green-600">{sessionHealth.connection}</span></span></div>
                    <div className="flex items-center gap-2"><Fullscreen className="h-4 w-4 text-muted-foreground"/> <span>Fullscreen: <span className="font-medium text-green-600">{sessionHealth.fullscreen}</span></span></div>
                    <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground"/> <span>Tab Focus: <span className="font-medium text-green-600">{sessionHealth.focus}</span></span></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Alert Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between"><span>Fullscreen Exits:</span> <span className="font-bold">{alertCounts.fullscreenExit}</span></div>
                    <div className="flex justify-between"><span>Tab Switches:</span> <span className="font-bold">{alertCounts.tabSwitch}</span></div>
                    <div className="flex justify-between"><span>Clipboard Use:</span> <span className="font-bold">{alertCounts.clipboard}</span></div>
                    <div className="flex justify-between"><span>Disconnects:</span> <span className="font-bold">{alertCounts.disconnects}</span></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">Session Progress</CardTitle>
                </CardHeader>
                 <CardContent>
                     <Progress value={60} className="mb-2"/>
                     <p className="text-sm text-center text-muted-foreground">36 / 60 minutes remaining</p>
                 </CardContent>
            </Card>
        </div>


        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Activity Timeline
                </CardTitle>
                <CardDescription>
                  Chronological log of events and alerts during the exam.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {activityLogs.map((log, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 text-sm"
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                log.severity === 'critical'
                                  ? 'bg-destructive/10 text-destructive'
                                  : log.severity === 'high'
                                  ? 'bg-orange-500/10 text-orange-500'
                                   : log.severity === 'medium'
                                   ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {log.type === 'focus' && <AlertTriangle className="h-4 w-4" />}
                              {log.type === 'activity' && <Keyboard className="h-4 w-4" />}
                              {log.type === 'snapshot' && <Camera className="h-4 w-4" />}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{log.severity} Severity</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            log.severity === 'critical' || log.severity === 'high'
                              ? 'text-destructive'
                              : ''
                          }`}
                        >
                          {log.event}
                        </p>
                        <p className="text-muted-foreground">{log.timestamp}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" />Add Note</Button>
                    <Button variant="outline"><Bookmark className="mr-2 h-4 w-4" />Mark for Review</Button>
                    <Button variant="secondary"><ShieldAlert className="mr-2 h-4 w-4" />Issue Warning</Button>
                    <Button variant="destructive"><Power className="mr-2 h-4 w-4" />End Session</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" /> Webcam Snapshots
                </CardTitle>
                <CardDescription>
                  Periodic and event-triggered snapshots.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {snapshotData.map((img) => (
                  <div key={img.id} className="group relative aspect-video overflow-hidden rounded-md border">
                     <Image
                        src={img.imageUrl}
                        alt={img.description}
                        width={320}
                        height={240}
                        data-ai-hint={img.imageHint}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                        <p className="text-xs font-bold">{img.timestamp}</p>
                        <p className="text-xs opacity-80 truncate">{img.trigger}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
