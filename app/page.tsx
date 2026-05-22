export const dynamic = "force-dynamic"

import SummaryFinance from "@/components/summary/SummaryFinance";
//@ts-ignore
import "./globals.css"
export default async function Home() {
  return (
    <div className="">
        <SummaryFinance />
    </div>
  );
}
