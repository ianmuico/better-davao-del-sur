import { ComingSoonTerminal } from "@/components/coming-soon-terminal";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <h1 className="sr-only">Better Davao del Sur: coming soon</h1>
      <ComingSoonTerminal />
    </main>
  );
}
