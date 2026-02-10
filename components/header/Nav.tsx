"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
export const navRoutes=[
    {
        href:"/",
        label:"Overview"
    },
    {
        href:"/transactions",
        label:"Transactions"
    },
    {
        href:"/accounts",
        label:"Accounts"
    },
    {
        href:"/categories",
        label:"Categories"
    },
    {
        href:"/settings",
        label:"Settings"
    },
]
export default function Nav() {
    const pathname=usePathname()
  return (
    <nav className='flex items-center gap-6'>
        {
            navRoutes.map((item:any)=>(
                <Button
                asChild
                key={item.label}
                size={"sm"}
                variant={"outline"}
                className={cn(
                    `transition font-normal hover:bg-white/20 outline-none
                    hover:text-white focus-visible:ring-offset-0 
                    focus-visible:ring-transparent border-none`,
                    pathname===item.href?"bg-white/10 text-white":"bg-transparent"
                )}
                >
                <Link href={item.href}>
                    {item.label}
                </Link>
                </Button>
            ))
        }
    </nav>
  )
}
