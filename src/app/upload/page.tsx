import { AppLayout } from '@/components/layout/AppLayout';
import { McqUploadForm } from '@/components/upload/McqUploadForm';

export default function UploadMcqPage() {
  return (
    <AppLayout pageTitle="Upload MCQs">
      <div className="flex flex-col items-center justify-center">
        <McqUploadForm />
      </div>
    </AppLayout>
  );
}
