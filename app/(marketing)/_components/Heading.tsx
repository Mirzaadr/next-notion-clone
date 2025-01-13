"use client"
import SigninButton from "@/components/auth/SigninButton";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Heading = () => {
  const isLoggedIn = false;
  const isLoading = false;
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to {" "}
        <span className="underline">Anotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Anotion is the connected workspace where better, faster work happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg"/>
        </div>
      )}

      {isLoggedIn && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Anotion
            <ArrowRight className="size-4 ml-2"/>
          </Link>
        </Button>
      )}
      {!isLoggedIn && !isLoading && (
        <SigninButton className="mt-6">
          <Button>
            Get Anotion Free
            <ArrowRight className="size-4 ml-2"/>
          </Button>
        </SigninButton>
      )}

    </div>
  )
}

export default Heading;