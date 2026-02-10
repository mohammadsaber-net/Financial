import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function calculateChangesInPercent(current:number,prev:number){
  if(prev===0){
     return prev===current ? 0 : 100
  } 
  return ((current - prev) / prev) * 100
}
export const formatCurrencyPer = (amount:number) => {
   return amount / 1000
}
export const formatCurrencyIn = (amount:number) => {
   return amount * 1000
}
export const formatingDate = (date:Date) => {
   return new Date(date).toLocaleString("en-US",
      {
         month:"short",
         day:"2-digit",
         year:"numeric"
      }
   )
}
export const formatingDateMOADA = (date:Date) => {
   return new Date(date).toLocaleString("en-US",
      {
         month:"short",
         day:"2-digit",
      }
   )
}