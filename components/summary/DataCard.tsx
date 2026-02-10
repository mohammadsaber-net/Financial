import { cn, formatCurrencyPer, formatingDate, formatingDateMOADA } from "@/lib/utils"
import { useCountUp } from "../hooks/useCountUp"
type Props={
    title:String,
    value:any[],
    loading:boolean,
    Icon:any,
    dateRange:{defaultTo:Date,defaultFrom:Date},
    amount:number,
    change:number,
}
export function DataCard({title,loading,value,change,amount,dateRange,Icon}:Props) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const safeChange = Number.isFinite(change) ? change : 0;
  const countAmount = useCountUp(safeAmount, 2000);
  const countChange = useCountUp(safeChange, 2000);
    return (
  <div className="bg-white rounded shadow p-2">
    {loading ? (
      // Skeleton UI
      <div className="flex justify-between animate-pulse">
        <div className="space-y-3 w-full">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-52" />
          <div className="h-8 bg-gray-200 rounded w-32 mt-4" />
          <div className="h-4 bg-gray-200 rounded w-44" />
        </div>

        <div className="h-10 w-10 bg-gray-200 rounded" />
      </div>
    ) : (
      // Real Content
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl md:text-2xl mb-1 font-semibold">
            {title}
          </h2>

          <div className="text-xs lg:text-sm text-gray-500">
            {formatingDateMOADA(dateRange.defaultFrom)} -{" "}
            {formatingDate(dateRange.defaultTo)}
          </div>

          <div className="font-semibold text-xl mt-4 md:text-2xl">
            {`${formatCurrencyPer(countAmount)} EGP`}
          </div>

          <p
            className={cn(
              "text-sm line-clamp-1",
              change > 0 && "text-emerald-500",
              change < 0 && "text-rose-500"
            )}
          >
            {`${countChange}% from last period`}
          </p>
        </div>

        <Icon
          className={value[0] + " size-10 p-2 rounded-sm " + value[1]}
        />
      </div>
    )}
  </div>
);

}