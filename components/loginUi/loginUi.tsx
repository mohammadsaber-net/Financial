import { Banknote,Loader2 } from "lucide-react"
import { ClerkLoaded,ClerkLoading } from "@clerk/nextjs"
type Props={
    Comp:any
}
export default function LoginUi({Comp}:Props) {
  return (
    <div className="min-h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      <div className="mt-6 w-full text-center">
        <h1 className="text-blue-600 text-2xl
        text-3xl md:text-4xl lg:text-5xl "
        >
            Welcome Back!
        </h1>
        <p className="text-gray-600 mt-2 mb-4 text-center">
            You can login <br/>
             Or create an account if it your first time
        </p>
        <div className="flex justify-center">
            <ClerkLoading>
                <Loader2 size={28} className="text-blue-600 animate-spin"/>
            </ClerkLoading>
            <ClerkLoaded>
                {Comp }
            </ClerkLoaded>
        </div>
      </div>
      <div className="hidden md:flex justify-center items-center bg-blue-600 
      text-white">
        <Banknote className="size-28"/>
      </div>
    </div>
  )
}
