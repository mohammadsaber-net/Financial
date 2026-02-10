"use client"
import { navRoutes } from './Nav'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Banknote, X } from 'lucide-react'
type props={
    setMenu:any,
    menu:any,
}
export default function Mobile({menu,setMenu}:props) {
    const pathname=usePathname()
  return (
    <div 
    onClick={()=>{setMenu(false)}}
    className={
    cn(`fixed transition-transform
    inset-0 md:hidden bg-black/50 duration-500 ease-in-out`,
    !menu?"-translate-x-full":"translate-x-0 z-50"
    )}>
    <div 
    onClick={(e)=>e.stopPropagation()}
    className={cn(
        `pt-4 w-[75%] bg-gradient-to-b from-blue-700 
        to-blue-500 h-full relative duration-300 delay-300 ease-in-out
        transition-transform`,
        !menu?"-translate-x-full":"translate-x-0"
    )}>
    <div className='flex text-white justify-between px-4'>
        <div className='flex items-center gap-2'>
            <Banknote /> Finance
        </div>
        <X 
        onClick={()=>{setMenu(false)}}
        className=' p-1 rounded size-8 cursor-pointer active:bg-white/20 bg-white/10'/>
    </div>
    <nav className='flex flex-col mt-6 gap-4 '>

    {
        navRoutes.map((item:any)=>(
            <Button
            onClick={()=>{setMenu(false)}}
            asChild
            key={item.label}
            size={"sm"}
            variant={"ghost"}
            className={cn(
                `transition font-normal hover:bg-white/20 outline-none
                hover:text-white focus-visible:ring-offset-0 text-gray-100 
                focus-visible:ring-transparent`,
                pathname===item.href?"bg-white/10 border-t border-white text-white":" border-none bg-transparent"
            )}
            >
            <Link href={item.href}>
                {item.label}
            </Link>
            </Button>
        ))
    }
    </nav>
    </div>
    </div>
  )
}
