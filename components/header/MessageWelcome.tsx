"use client"
import { useUser } from "@clerk/nextjs"

export default function MessageWelcome() {
  const { user, isLoaded } = useUser()
    return (
    <div>
      <h1 className="font-semibold text-xl md:text-4xl mb-4 text-white tracking-wider mt-10">
        Welcome Back {isLoaded ? `mr/ms: ${user?.firstName}` : "..."} 👋
      </h1>

      <p className="text-slate-300 text-sm md:text-base">
        This is your financial overview.<br />
        Here you can manage all your transactions
      </p>
    </div>
  )
}

// "use client"
// import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/nextjs"
// import { Hand, Loader2 } from "lucide-react"

// export default function MessageWelcome() {
//   const {user,isLoaded}=useUser()
//   return (
//     <div>
//       <h1 className="font-semibold text-xl md:text-4xl mb-4
//       text-white  tracking-wider mt-10">
//         Welcome Back 
//         <ClerkLoading>
//           <Loader2 className='size-8 inline animate-spin text-blue-200'/>
//         </ClerkLoading>
//         <ClerkLoaded>{isLoaded? " mr/ms: ":" "}{user?.firstName}👋</ClerkLoaded>
//       </h1>
//       <p className="text-slate-300 text-sm md:text-base">
//         This is your financial overview.<br />
//         Here you can manage all your transactions
//       </p>
//     </div>
//   )
// }
