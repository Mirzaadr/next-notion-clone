// import { signOut } from 'next-auth/react';

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

type SigninButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
  className?: React.HTMLProps<HTMLDivElement>["className"];
  signInHref?: string;
}

const SigninButton = ({
  children,
  mode="modal",
  asChild,
  className,
  signInHref="/signin"
}: SigninButtonProps) => {
  const onClick = () => {
    redirect(signInHref || "/")
  }

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <div onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </div>
  )
}

export default SigninButton;