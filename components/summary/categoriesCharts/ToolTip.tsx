import { Separator } from '@/components/ui/separator'
import {formatCurrencyPer} from '@/lib/utils'

export default function ToolTipCustom({active,payload}:any) {
    // if(!active) return null
    if (!active || !payload || !payload.length) return null
    const name=payload[0].payload.name
    const value=payload[0].value
  return (
    <div className='rounded border bg-white overflow-hidden shadow'>
      <div className='text-sm p-2 text-muted-foreground px-3'>
        {name}
      </div>
      <Separator />
      <div className='p-2 px-3'>
        <div className='flex items-center flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <div className='size-1.5 bg-rose-500 rounded-full'/>
                <p className='text-sm text-muted-foreground'>
                    Expenses
                </p>
            <p className='text-sm text-right font-medium'>
                {formatCurrencyPer(value)} EGP
            </p>
            </div>
        </div>
      </div>
    </div>
  )
}
