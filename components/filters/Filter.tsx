import React from 'react'
import AccountFilter from './AccountFilter'
import DateFilter from './DateFilter'

export default function Filter() {
  return (
    <div className='flex gap-2 mt-3 mb-5'>
      <AccountFilter />
      <DateFilter />
    </div>
  )
}
