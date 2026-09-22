import AIMentor from '@/components/AIMentor';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIMentor />
    </>
  );
}
