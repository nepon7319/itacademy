import AIMentor from '@/components/AIMentor';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIMentor />
    </>
  );
}
