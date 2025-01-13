"use client"
import React from 'react';
import { Button } from '../ui/button';
import GithubLogo from "@/public/github.svg";
import GoogleLogo from "@/public/google.svg";
import { signIn } from 'next-auth/react';
// import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface SocialProps {
  isGoogleActive?: boolean;
  isGithubActive?: boolean;
}

const Social = ({
  isGithubActive,
  isGoogleActive
}: SocialProps) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callBackUrl: callbackUrl || "/",
    })
  }
  if (!isGithubActive && !isGoogleActive) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <h3>Please Activate OAuth Sign In</h3>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center gap-x-2">
      {isGoogleActive && (
        <Button
          size={"lg"}
          variant="outline"
          className="w-full"
          onClick={() => onClick("google")}
        >
          <Image src={GoogleLogo} alt='google-logo' className='size-4 mr-2'/>
          Sign In with Google
        </Button>
      )}
      {isGithubActive && (
        <Button
          size={"lg"}
          variant="outline"
          className="w-full"
          onClick={() => onClick("github")}
          >
          <Image src={GithubLogo} alt='github-logo' className='size-4 mr-2'/>
          Sign In with Github
        </Button>
      )}
    </div>
  );
}

export default Social;