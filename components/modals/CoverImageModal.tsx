"use client"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
 } from "@/components/ui/dialog";
import { useCoverImage } from "@/lib/hooks/useCoverImage";
import { SingleImageDropzone } from "../SingleImageDropzone";
import { useState } from "react";
import { toast } from "sonner";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { updateDocument } from "@/lib/data/documents";
import { queryClient } from "../providers/QueryProviders";
import { useParams } from "next/navigation";
import { uploadFile } from "@/lib/data/file";

const CoverImageModal = () => {
  const coverImage = useCoverImage();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams()

  const update = useMutation({
    mutationFn: (args: {
      id: string
      coverImage?: string
    }) => updateDocument(args),
    onSuccess: () => Promise.all([
      // queryClient.invalidateQueries({ queryKey: ['documents'] }),
      queryClient.invalidateQueries({ queryKey: ['document', params.documentId] }),
    ]),
  });

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  }

  const onChange = (selectedFile?: File) => {
    setFile(selectedFile);
    if (selectedFile) {
      setIsSubmitting(true);
      uploadFile({ file: selectedFile, fileName: `cover-image-${params.documentId}` }).then((res) => {
        if (res?.success && res.data) {
          
          const promise = update.mutateAsync({
            id: params.documentId as string,
            coverImage: res.data?.url, 
          });
          
          toast.promise(promise, {
            loading: "Uploading cover image...",
            success: "Cover image added",
            error: "Failed to upload cover image.",
          });
        } else {
          console.error(res.message);
          toast.error("Failed to upload image");
        }
      }).finally(() => {
        onClose();
      })
    }
  }

  
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <DialogTitle hidden/>
          <h2 className="text-center text-lg font-medium">
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone 
          className="w-full outline-none"
          isSubmitting={isSubmitting}
          value={file}
          onChange={onChange}
          dropzoneOptions={{
            maxSize: 1048576
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal;