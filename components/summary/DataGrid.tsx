"use client"
import React, { useState } from 'react'
import {DataCard} from './DataCard'
import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from 'react-icons/fa6'
const variants={
    default:"bg-blue-500/20",
    success:"bg-emerald-500/20",
    danger:"bg-rose-500/20",
    worning:"bg-yellow-500/20"
}
const IconVariants={
    default:"fill-blue-500",
    success:"fill-emerald-500",
    danger:"fill-rose-500",
    worning:"fill-yellow-500"
}
type Props={
  data:any,
  loading:boolean
}
export default function DataGrid({data,loading}:Props) {
  const [dateRange,setDateRange]=useState<{defaultTo:Date,defaultFrom:Date}>({
    defaultTo:new Date(Date.now()),
    defaultFrom:new Date(Date.now() - (30 * 60 * 60 *24 *1000))
})  
  return (
    <div 
    className='grid relative -mt-16 z-10 grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-8 mb-8'>
      <DataCard
      title={"Remaining"}
      value={[variants.default,IconVariants.default]}
      Icon={FaPiggyBank}
      dateRange={dateRange}
      loading={loading}
      amount={(data?.currentPeriod.remaining)}
      change={data?.remainingChange}
      />
      <DataCard
      title={"Income"}
      loading={loading}
      value={[variants.success,IconVariants.success]}
      Icon={FaArrowTrendUp}
      dateRange={dateRange}
      amount={(data?.currentPeriod.income)}
      change={data?.incomeChange}
      />
      <DataCard
      title={"Expenses"}
      loading={loading}
      value={[variants.danger,IconVariants.danger]}
      Icon={FaArrowTrendDown}
      dateRange={dateRange}
      amount={(data?.currentPeriod.expenses)}
      change={data?.expensesChange}
      />
    </div>
  )
}
