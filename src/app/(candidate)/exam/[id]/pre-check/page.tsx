
import { DashboardLayout } from '@/components/dashboard/layout';
import { PreCheckCard } from '@/components/candidate/pre-check-card';

export default function PreCheckPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="flex flex-col items-center justify-center p-4">
        <PreCheckCard examId={params.id} />
      </div>
    </DashboardLayout>
  );
}
