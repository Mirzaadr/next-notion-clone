"use client"

import { queryClient } from "@/components/providers/QueryProviders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { updateDocument } from "@/lib/data/documents";
import { Document } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";

interface TitleProps {
  initialData: Document;
}

const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation({
    mutationFn: (args: {
      id: string
      title?: string
      content?: string
      coverImage?: string
      icon?: string
      isPublished?: boolean
    }) => updateDocument(args),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['documents'] }),
      queryClient.invalidateQueries({ queryKey: ['document', initialData.id] }),
    ]),
  });
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  }

  const disableInput = () => {
    setIsEditing(false)
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event?.target.value);
    update.mutateAsync({
      id: initialData.id,
      title: event.target.value || "Untitled",
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  }


  return (
    <div className='flex items-center gap-x-1'>
      {!!initialData.icon && (
        <p>{initialData.icon}</p>
      )}
      {isEditing ? (
        <Input ref={inputRef} onClick={enableInput} onBlur={disableInput} onChange={onChange} onKeyDown={onKeyDown} value={title} className="h-7 px-2 focus-visible:ring-transparent"/>
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span>
            {initialData.title}
          </span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rounded-md"/>
  );
}

export default Title;