import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="fixed top-4 right-4 z-[1000] flex items-center gap-2 rounded-full border bg-background/80 p-2 backdrop-blur-sm shadow-lg">
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
