// import { signOut } from 'next-auth/react';

import { signOut } from "next-auth/react";

type SignoutButtonProps = {
  children?: React.ReactNode;
}

const SignoutButton = ({
  children
}: SignoutButtonProps) => {
  const onClick = () => {
    // console.log("signout")
    signOut({
      redirectTo: "/"
    });
  }
  return (
    <span onClick={onClick} className='cursor-pointer'>
      {children}
    </span>
  )
}

export default SignoutButton;