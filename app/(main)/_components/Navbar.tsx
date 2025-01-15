"use client"

import { getDocumentById } from "@/lib/data/documents";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Title from "./Title";
import Banner from "./Banner";
import Menu from "./Menu";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({
  isCollapsed,
  onResetWidth,
}: NavbarProps) => {
  const params = useParams();
  const { data: document } = useQuery({
    queryKey: ['document', params.documentId],
    queryFn: async () => {
      const response = await getDocumentById({
        documentId: params.documentId as string,
      });
      return response.data;
    }
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="size-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document}/>
          <div className="flex items-center gap-x-2">
            <Menu documentId={document.id} />
          </div>
        </div>
      </nav>
      {document.isArchived && (
        <Banner documentId={document.id}/>
      )}
    </>
  );
}

export default Navbar;