import { Printer, Waves } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeaderProps {
  handlePrint: () => void;
}

export function Header({ handlePrint }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
        <Waves className="h-6 w-6 text-primary" />
        <span className="text-2xl font-headline font-bold text-foreground">
          SAFE Navigator
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
         <Button onClick={() => handlePrint()} variant="outline">
          <Printer className="mr-2" />
          Export to PDF
        </Button>
      </nav>
    </header>
  );
}
