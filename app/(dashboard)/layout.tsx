import Header from "@/components/header/Header"
import { Toaster } from "react-hot-toast";

type props={
    children:React.ReactNode
}
export default function layout({children}:props) {
  return (
    <>
    <Header />
    <main className="px-5 md:px-14 max-w-6xl">
      {children}
      <Toaster position="top-left" />
    </main>
    </>
  )
}
