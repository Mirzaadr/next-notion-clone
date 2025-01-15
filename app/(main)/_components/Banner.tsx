"use client"

import ConfirmModal from "@/components/modals/ConfirmModal";
import { queryClient } from "@/components/providers/QueryProviders";
import { Button } from "@/components/ui/button";
import { removeDocument, restoreDocument } from "@/lib/data/documents";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { toast } from "sonner";

interface BannerProps {
  documentId: string
}

const Banner = ({
  documentId,
}: BannerProps) => {
  const router = useRouter();
  const restore = useMutation({
    mutationFn: (documentId: string) => restoreDocument({ documentId }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trash"] }),
        queryClient.invalidateQueries({ queryKey: ["documents"] }),
        queryClient.invalidateQueries({ queryKey: ["document"] }),
      ]),
  });
  const remove = useMutation({
    mutationFn: (documentId: string) => removeDocument({ documentId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trash"] }),
  });

  const onRestore = () => {
    const promise = restore.mutateAsync(documentId);

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored",
      error: "Failed to restore note.",
    });
  };

  const onRemove = () => {
    const promise = remove.mutateAsync(documentId).then(() => {
      router.push("/documents");
    });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted",
      error: "Failed to delete note.",
    });
    // if (params.documentId === documentId) {
    //   router.push("/documents");
    // }
  };
  return (
    <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
      <p>
        This page is in the Trash
      </p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default Banner;