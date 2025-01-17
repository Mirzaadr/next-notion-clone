"use client"
import { queryClient } from "@/components/providers/QueryProviders";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { archiveDocument } from "@/lib/data/documents";
import { useRequireUser } from "@/lib/hooks/requireUser";
import { useMutation } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
  documentId: string;
}

const Menu = ({
  documentId,
}: MenuProps) => {
  const router = useRouter();
  const { user } = useRequireUser(false);

  // const create = useMutation({
  //   mutationFn: ({
  //     parentId,
  //     title,
  //   }: {
  //     parentId?: string;
  //     title?: string;
  //   }) => createDocument({ parentId, title }),
  //   onSuccess: () =>
  //     queryClient.invalidateQueries({ queryKey: ["documents", id] }),
  // });
  const archive = useMutation({
    mutationFn: (id: string) => archiveDocument({ documentId: id}),
    onSuccess: () => 
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["documents"] }),
        queryClient.invalidateQueries({ queryKey: ["document", documentId] }),
      ]),
  });

  const onArchive = () => {
    if (!documentId) return;
    const promise = archive.mutateAsync(documentId).then((res) => {
      router.push("/documents")
    });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to remove note."
    });
    router.push("/documents");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="">
          <MoreHorizontal className="size-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="size-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return (
    <Skeleton className="h-10 w-10"/>
  )
}

export default Menu;