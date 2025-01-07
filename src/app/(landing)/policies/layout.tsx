export default function Policies({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc((100vh-4.5rem-1px)+2rem)] flex-col items-center p-4 sm:p-16">
      <div className="flex w-[min(100ch,100%)] flex-col gap-6">{children}</div>
    </main>
  );
}
