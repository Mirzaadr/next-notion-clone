"use client"

import CoverImage from "@/app/(main)/_components/CoverImage";
import dynamic from "next/dynamic";
import Toolbar from "@/components/Toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentById } from "@/lib/data/documents";
import { useEffect, useMemo, useState, use } from "react";
import { Document } from "@prisma/client";

interface PreviewPageProps {
  params: Promise<{
    documentId: string;
  }>
}

const PreviewPage = ({
  params,
}: PreviewPageProps) => {
  const resolvedParams = use(params);
  const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);
  
  useEffect(() => {
    getDocumentById({ documentId: resolvedParams.documentId }).then((res) => {
      setDocument(res.data);
      setIsLoading(false);
    })
  }, [resolvedParams]);

  if (isLoading) {
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
      <div>Not Found</div>
    );
  } else {
    return (
      <div className="pb-40">
        <CoverImage preview documentId={document.id} url={document.coverImage || undefined} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <div className="pl-[54px] bg-black relative"/>
          <Toolbar preview initialData={document} />
          <Editor
            editable={false}
            onChange={() => {}}
            initialContent={document.content}
          />
        </div>
      </div>
    );
  }
};

export default PreviewPage;
