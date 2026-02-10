import { Separator } from '@/components/ui/separator'
import { formatCurrencyPer, formatingDate} from '@/lib/utils'


export default function ToolTipCustom({active,payload}:any) {
    if(!active) return null
    const date=payload[0].payload.date
    const income=payload[0].value
    const expenses=payload[1].value
  return (
    <div className='rounded border bg-white overflow-hidden shadow'>
      <div className='text-sm p-2 text-muted-foreground px-3'>
        {formatingDate(date)}
      </div>
      <Separator />
      <div className='p-2 px-3'>
        <div className='flex items-center flex-col gap-4'>
        <div className='flex items-center gap-2'>
            <div className='size-1.5 bg-blue-500 rounded-full'/>
              <p className='text-sm text-muted-foreground'>
                    Income
              </p>
            <p className='text-sm text-right font-medium'>
                {formatCurrencyPer(income)} EGP
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='size-1.5 bg-rose-500 rounded-full'/>
                <p className='text-sm text-muted-foreground'>
                    expenses
                </p>
            <p className='text-sm text-right font-medium'>
                {formatCurrencyPer(expenses)} EGP
            </p>
            </div>
        </div>
      </div>
    </div>
  )
}
