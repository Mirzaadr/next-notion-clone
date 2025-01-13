"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoutButton from '@/components/auth/SignoutButton';
import { LogOutIcon, User2 } from 'lucide-react';
import { useRequireUser } from '@/lib/hooks/requireUser';

const UserButton = () => {
  const { user } = useRequireUser(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback >
              <AvatarImage src={user?.image || ""}/>
              <User2 />
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