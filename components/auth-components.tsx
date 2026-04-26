import { handleSignIn, handleSignOut } from "@/app/actions/auth";
import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./ui/button";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const signInWithProvider = handleSignIn.bind(null, provider);

  return (
    <form action={signInWithProvider}>
      <Button {...props} variant="ghost">
        <HugeiconsIcon icon={GoogleIcon} />
        Entrar com Google
      </Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={handleSignOut} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sair
      </Button>
    </form>
  );
}
