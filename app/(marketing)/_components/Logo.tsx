import Image from 'next/image';
import { Lustria } from "next/font/google";
import { cn } from '@/lib/utils';

const font = Lustria({
  subsets: ["latin"],
  weight: ["400"],
})

const Logo = () => {
  return (
    <div className='hidden md:flex items-center gap-x-2 justify-center'>
      <Image
        src="/logo.svg"
        alt='logo'
        height={30}
        width={30}
      />
      
      <p className={cn("font-semibold mt-2", font.className)}>Anotion</p>
    </div>
  )
}

export default Logo;