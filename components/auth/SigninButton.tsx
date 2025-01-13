// import { signOut } from 'next-auth/react';

import { cn } from "@/lib/utils";

type SigninButtonProps = {
  children?: React.ReactNode;
  className?: React.HTMLProps<HTMLElement>["className"];
}

const SigninButton = ({
  children,
  className
}: SigninButtonProps) => {
  const onClick = () => {
    // TODO: implement sign in
    console.log("signin")
  }
  return (
    <div onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </div>
  )
}

export default SigninButton;