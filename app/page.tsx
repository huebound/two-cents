import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl text-center">Welcome to Two Cents Club.</h1>
        <div className="flex gap-4">
          <Button>Join the Club</Button>
        </div>
      </main>
    </div>
  );
}
