// import { signOut } from 'next-auth/react';

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { HTMLAttributes } from "react";

type SignoutButtonProps = {
  children?: React.ReactNode;
  className?: React.HTMLProps<HTMLSpanElement>["className"]
}

const SignoutButton = ({
  children,
  className,
}: SignoutButtonProps) => {
  const onClick = () => {
    // console.log("signout")
    signOut({
      redirectTo: "/"
    });
  }
  return (
    <span onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </span>
  )
}

export default SignoutButton;