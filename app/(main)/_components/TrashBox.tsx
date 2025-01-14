"use client"
import ConfirmModal from "@/components/modals/ConfirmModal";
import { queryClient } from "@/components/providers/QueryProviders";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { getTrash, removeDocument, restoreDocument } from "@/lib/data/documents";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { data: documents } = useQuery({
      queryKey: ['trash'],
      queryFn: async () => {
        const response = await getTrash();
        return response.data;
      }
    });
  const restore = useMutation({
    mutationFn: (documentId: string) => restoreDocument({ documentId }),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['trash'] }),
      queryClient.invalidateQueries({ queryKey: ['documents'] }),
    ]),
  });
  const remove = useMutation({
    mutationFn: (documentId: string) => removeDocument({ documentId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trash'] }),
  });

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string,
  ) => {
    event.stopPropagation();
    const promise = restore.mutateAsync(documentId).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['documents', documentId] })
    });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored",
      error: "Failed to restore note."
    });
  }

  const onRemove = (
    documentId: string,
  ) => {
    // event.stopPropagation();
    const promise = remove.mutateAsync(documentId);

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted",
      error: "Failed to delete note."
    });
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  }

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg"/>
      </div>
    )
  }
  return (
    <div className='text-sm'>
      <div className="flex items-center gap-x-1 p-2">
        <Search className="size-4"/>
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground">
          No documents found
        </p>
        {filteredDocuments?.map((document) => (
          <div key={document.id} role="button" onClick={() => onClick(document.id)} className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between">
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div onClick={(e) => onRestore(e, document.id)} role="button" className="rounded-sm p-2 hover:bg-neutral-200">
                <Undo className="size-4 text-muted-foreground"/>
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div className="rounded-sm p-2 hover:bg-neutral-200">
                  <Trash className="size-4 text-muted-foreground"/>
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox;