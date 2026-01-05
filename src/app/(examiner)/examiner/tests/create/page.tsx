'use client';
import { CreateTestForm } from '@/components/examiner/create-test-form';

export default function CreateTestPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create New Test</h1>
        <p className="text-muted-foreground">
          Follow the steps to configure and publish your new test.
        </p>
      </div>
      <CreateTestForm />
    </div>
  );
}
