"use client"
import Spinner from "@/components/Spinner";
import Navigation from "./_components/Navigation";
import { useEffect, useState } from "react";
import { useRequireUser } from "@/lib/hooks/requireUser";
import { ReactQueryProvider } from "@/components/providers/QueryProviders";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useRequireUser()
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg"/>
      </div>
    )
  }

  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
      <ReactQueryProvider>
        <Navigation />
        <main className="flex-1 h-full overflow-y-auto">
          {children}
        </main>
      </ReactQueryProvider>
    </div>
  )
}

export default MainLayout;