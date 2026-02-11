"use client"
import { Banknote, Loader2, MenuIcon } from 'lucide-react'
import Nav from './Nav'
import Mobile from './Mobile'
import { useState } from 'react'
import { ClerkLoaded, ClerkLoading,UserButton} from '@clerk/nextjs'
import MessageWelcome from './MessageWelcome'
import Link from 'next/link'
import Filter from '../filters/Filter'
export default function Header() {
  const [menu,setMenu]=useState(false)
  return (
    <header className='bg-gradient-to-b from-blue-700 mb-4 to-blue-500 px-5 
    py-6 md:px-14 pb-16'>
      <div className='max-w-6xl flex justify-between'>
      <div className='hidden text-white items-center gap-20 md:flex'>
        <Link href={"/"} className='flex items-center gap-2'>
            <Banknote /> Finance
        </Link>
        <Nav />
      </div>
      <MenuIcon 
      onClick={()=>setMenu(true)}
      className='md:hidden
      transition font-normal bg-white/20 active:bg-white/30 hover:bg-white/10 outline-none text-gray-100
      text-white focus-visible:ring-offset-0 p-1 size-8 rounded cursor-pointer 
      focus-visible:ring-transparent border-none'/>
      <Mobile menu={menu} setMenu={setMenu}/>
      <ClerkLoaded> 
      <UserButton />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='size-8 animate-spin text-blue-200'/>
      </ClerkLoading>
      {/* <UserButton/> */}
      </div>
      <MessageWelcome/>
      <Filter />
    </header>
  )
}
