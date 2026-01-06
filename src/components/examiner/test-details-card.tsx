'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, ClipboardList, Shield, User } from 'lucide-react';
import type { Test } from '@/app/(admin)/admin/tests/page';

const ReviewItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-start py-3">
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-base">{value}</p>
    </div>
  </div>
);

export function TestDetailsCard({ test }: { test: Test }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Details
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <ReviewItem label="Test Name" value={test.title} />
          <ReviewItem label="Test Description" value={test.description} />
          <ReviewItem label="Test ID" value={<Badge variant="secondary">{test.id}</Badge>} />
          <ReviewItem label="Created By" value={<div className="flex items-center gap-2"><User className="h-4 w-4" />{test.createdBy}</div>} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <ReviewItem label="Exam Date" value={test.scheduling.date} />
          <ReviewItem
            label="Time Window"
            value={`${test.scheduling.startTime} - ${test.scheduling.endTime}`}
          />
          <ReviewItem
            label="Duration"
            value={`${test.scheduling.duration} minutes`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <ReviewItem label="MCQs" value={`${test.questions.mcqCount}`} />
          <ReviewItem
            label="Descriptive Questions"
            value={`${test.questions.descriptiveCount}`}
          />
          <ReviewItem
            label="Total Questions"
            value={test.questions.mcqCount + test.questions.descriptiveCount}
          />
          <ReviewItem label="Total Marks" value={`${test.marks}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rules & Proctoring
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <ReviewItem
            label="Mandatory Fullscreen"
            value={test.rules.fullscreen ? 'Enabled' : 'Disabled'}
          />
          <ReviewItem
            label="Require Webcam"
            value={test.rules.requireWebcam ? 'Enabled' : 'Disabled'}
          />
          <ReviewItem
            label="Snapshot Interval"
            value={test.rules.snapshotInterval}
          />
          <ReviewItem
            label="Focus Loss Handling"
            value={test.rules.focusHandling}
          />
        </CardContent>
      </Card>
    </div>
  );
}
