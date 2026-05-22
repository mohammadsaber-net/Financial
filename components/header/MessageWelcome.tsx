"use client"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react";

export default function MessageWelcome() {
  const { user, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
    return (
    <div>
      <h1 className="font-semibold text-xl md:text-4xl mb-4 text-white tracking-wider mt-10">
        Welcome Back{" "}
        {!mounted ? (
          <Loader2 className="text-blue-100 inline-block ms-2 size-8 animate-spin" />
        ) : (
          `mr/ms: ${user?.firstName}👋`
        )}
      </h1>
      
      <p className="text-slate-300 text-sm md:text-base">
        This is your financial overview.<br />
        Here you can manage all your transactions
      </p>
    </div>
  )
}
