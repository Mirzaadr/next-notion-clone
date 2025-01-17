"use client"

import React, { useCallback, useEffect, useState } from "react";
import CoverImage from "@/app/(main)/_components/CoverImage";
import dynamic from "next/dynamic";
import Toolbar from "@/components/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentById, updateDocument } from "@/lib/data/documents";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryClient } from "@/components/providers/QueryProviders";
import { debounce } from "lodash"

interface DocumentIdPageProps {
  params: Promise<{
    documentId: string;
  }>
}

const DocumentIdPage = ({
  params,
}: DocumentIdPageProps) => {
  const resolvedParams = React.use(params);
  const { documentId } = resolvedParams;
  const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);
  const { data: document } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await getDocumentById({
        documentId,
      });
      return response.data;
    },
  });

  const update = useMutation({
    mutationFn: (args: {
      id: string
      content?: string
    }) => updateDocument(args),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['documents'] }),
      queryClient.invalidateQueries({ queryKey: ['document', document?.id] }),
    ]),
  });

  const uploadData = useCallback((content: string) => {
    if (document) {
      update.mutate({
        id: document.id,
        content: content,
      });
    }
  }, [document, update]);

  // memoize the debounce call with useMemo
  const debouncedUploadData = useMemo(() => {
    return debounce(uploadData, 1000);
  }, [uploadData]);

  const onChange = (content: string) => {
    debouncedUploadData(content);
  };
  
  if (document === undefined) {
    return (<div>
      <CoverImage.Skeleton />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-14 w-[80%]" />
          <Skeleton className="h-14 w-[40%]" />
          <Skeleton className="h-14 w-[60%]" />
        </div>
      </div>
    </div>);
  }
  
  if (document === null) {
    return (
      <div className="pb-40 mx-auto">
        <div>Not Found</div>
      </div>
    );
  }

  return <div className="pb-40">
    <CoverImage documentId={document.id} url={document.coverImage || undefined} />
    <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
      <Toolbar initialData={document} />
      <Editor
        onChange={onChange}
        initialContent={document.content}
      />
    </div>
  </div>;
};

export default DocumentIdPage;
