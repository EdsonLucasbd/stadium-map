import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="fixed top-16 right-4 sm:top-4 z-[1010] flex items-center gap-2 rounded-full border bg-background/80 p-2 backdrop-blur-sm shadow-lg">
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
