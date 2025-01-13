import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const DocumentPage = () => {
  const user = {
    name: ""
  }
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcom to {user.name}&apos;s Anotion
      </h2>
      <Button >
        <PlusCircle className="size-4 mr-2"/>
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage;