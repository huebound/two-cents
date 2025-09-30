import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-center">
          Welcome to Two Cents Club
        </h1>
        <div className="flex gap-4">
          <Button>Sign Up</Button>
          <Button variant="outline">Login</Button>
        </div>
      </main>
    </div>
  );
}
