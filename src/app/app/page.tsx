import { Button } from "@/components/ui/button";

export default function AppPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">App Page</h1>
      <p className="text-gray-500">This page is under construction</p>
      <Button href="/home" className="mt-4" variant="link">
        Go back to Home
      </Button>
    </div>
  );
}
