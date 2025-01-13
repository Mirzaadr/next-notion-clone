"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useCurrentUser } from '@/hooks/useCurrentUser';
import LogoutButton from '@/components/auth/SignoutButton';
import { LogOutIcon, User, UserCircle2 } from 'lucide-react';
import Image from 'next/image';

type Props = {
  label?: string;
};

const UserButton = (props: Props) => {
  // const user = useCurrentUser();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback >
              <User />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='end'>
          <LogoutButton>
            <DropdownMenuItem>
              <LogOutIcon className='size-4 mr-2' />
              Logout
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserButton;