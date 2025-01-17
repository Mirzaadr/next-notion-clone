"use client"

import React from "react";
import CoverImage from "@/app/(main)/_components/CoverImage";
import Toolbar from "@/components/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentById } from "@/lib/data/documents";
import { useQuery } from "@tanstack/react-query";

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
  const { data: document } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const response = await getDocumentById({
        documentId,
      });
      return response.data;
    }
  });
    
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
    </div>
  </div>;
};

export default DocumentIdPage;
