import { Header } from "@/components/header";
import { SafeSimulator } from "@/components/safe-simulator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SafeSimulator />
      </main>
    </div>
  );
}
