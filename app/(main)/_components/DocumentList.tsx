"use client"

import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Item from "./Item";
import { FileIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSidebar } from "@/lib/data/documents";

interface DocumentListProps {
  parentDocumentId?: string | null;
  level?: number;
  data?: Document[];
}

export const DocumentList = ({
  parentDocumentId=null,
  level=0,
  // data,
}: DocumentListProps) => {

  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  // get documents
  const { data: documents } = useQuery({
    queryKey: ['documents' + (parentDocumentId ?? "")],
    queryFn: async () => {
      const response = await getSidebar({
        parentId: parentDocumentId
      });
      return response.data;
    }
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  }

  // implement loading with skeleton
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  console.log(documents);
  
  return (
    <>
      <p style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : '12px',
      }}
      className={cn(
        "hidden text-sm font-medium text-muted-foreground/80",
        expanded && "last:block",
        level === 0 && "hidden"
      )}>
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document.id}>
          <Item 
            id={document.id}
            label={document.title}
            onClick={() => onRedirect(document.id)}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document.id}
            level={level}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
          />
          {expanded[document.id] && (
            <DocumentList
              parentDocumentId={document.id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  )
}
