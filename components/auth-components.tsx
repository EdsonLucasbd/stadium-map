import { handleSignIn, handleSignOut } from "@/app/actions/auth";
import { GoogleIcon, GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function SignIn({
  provider = "google",
  ...props
}: { provider?: "google" | "github" } & React.ComponentPropsWithRef<typeof Button>) {
  const signInWithProvider = handleSignIn.bind(null, provider);
  
  const icons = {
    google: GoogleIcon,
    github: GithubIcon,
  };
  
  const labels = {
    google: "Entrar com Google",
    github: "Entrar com GitHub",
  };

  return (
    <form action={signInWithProvider}>
      <Button {...props} variant="ghost" className={cn("gap-2", props.className)}>
        <HugeiconsIcon icon={icons[provider]} className="h-5 w-5 shrink-0" />
        <span className="hidden sm:inline">{labels[provider]}</span>
      </Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={handleSignOut} className="w-full">
      <button 
        type="submit" 
        className="flex w-full items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
      >
        Sair
      </button>
    </form>
  );
}
