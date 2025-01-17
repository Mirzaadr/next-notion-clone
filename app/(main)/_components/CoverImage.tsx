import { queryClient } from "@/components/providers/QueryProviders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { removeDocumentCover } from "@/lib/data/documents";
import { useCoverImage } from "@/lib/hooks/useCoverImage";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
  documentId: string;
}
const CoverImage = ({
  url,
  preview,
  documentId,
}: CoverImageProps) => {
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation({
    mutationFn: (args: { id: string }) => removeDocumentCover(args),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["documents"] }),
        queryClient.invalidateQueries({
          queryKey: ["document", documentId],
        }),
      ]),
  });

  const onRemove = () => {
    removeCoverImage.mutate({
      id: documentId
    });
  }

  return (
    <div className={cn(
      "relative w-full h-[35vh] group",
      !url && "h-[12vh]",
      url && "bg-muted",
    )}>
      {!!url && (
        <>
          <Image 
            src={url}
            fill
            alt="cover-image"
            loading="eager"
            className="object-cover"
          />
        </>
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onOpen()}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="size-4 mr-2"/>
            Change Cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="size-4 mr-2"/>
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

CoverImage.Skeleton = function CoverImageSkeleton() {
  return (
    <Skeleton 
      className="w-full h-[12vh]"
    /> 
  )
}

export default CoverImage;