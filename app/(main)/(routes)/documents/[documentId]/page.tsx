"use client"

import Toolbar from "@/components/Toolbar";
import { getDocumentById } from "@/lib/data/documents";
import { useQuery } from "@tanstack/react-query";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  }
}

const DocumentIdPage = ({
  params,
}: DocumentIdPageProps) => {
  const { documentId } = params;
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
    return (<div>Loading...</div>);
  }

  if (document === null) {
    return (
      <div>Not Found</div>
    );
  }

  return <div className="pb-40">
    <div className="h-[35vh]"/>
    <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
      <Toolbar initialData={document} />
    </div>
  </div>;
};

export default DocumentIdPage;
