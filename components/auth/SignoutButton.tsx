// import { signOut } from 'next-auth/react';

type SignoutButtonProps = {
  children?: React.ReactNode;
}

const SignoutButton = ({
  children
}: SignoutButtonProps) => {
  const onClick = () => {
    // TODO: implement sign out
    console.log("signOut")
  }
  return (
    <span onClick={onClick} className='cursor-pointer'>
      {children}
    </span>
  )
}

export default SignoutButton;