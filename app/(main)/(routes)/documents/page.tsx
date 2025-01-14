"use client"

import { queryClient } from "@/components/providers/QueryProviders";
import { Button } from "@/components/ui/button";
import { createDocument } from "@/lib/data/documents";
import { useRequireUser } from "@/lib/hooks/requireUser";
import { useMutation } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const DocumentPage = () => {
  const { isLoading, user } = useRequireUser();

  const addMutation = useMutation({
    mutationFn: (title?: string) => createDocument({ title }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  })

  const onCreate = () => {
    // create a new document: title, userId, parentId
    const promise = addMutation.mutateAsync("Untitled");
    
    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created",
      error: "Failed to create a new note.",
    });
  }
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.name}&apos;s Anotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="size-4 mr-2"/>
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage;