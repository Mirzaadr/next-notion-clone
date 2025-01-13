"use client"

import { useScrollTop } from "@/lib/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { ModeToggle } from "@/components/ModeToggle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserButton from "@/components/auth/UserButton";
import SigninButton from "@/components/auth/SigninButton";
import { useRequireUser } from "@/lib/hooks/requireUser";

const Navbar = () => {
  const scrolled = useScrollTop();
  const { isLoading, isAuthenticated: isLoggedIn } = useRequireUser(false);

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-3">
        {isLoading && (
          <Spinner />
        )}
        {!isLoggedIn && !isLoading && (
          <>
          <SigninButton asChild>
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </SigninButton>
          <SigninButton asChild>
            <Button size="sm">
              Get Anotion Free
            </Button>
          </SigninButton>
          </>
        )}
        {isLoggedIn && !isLoading && (
          <>
            <Button size="sm" asChild>
              <Link href="/documents">
                Enter Anotion
              </Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;