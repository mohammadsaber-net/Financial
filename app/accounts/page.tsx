export const dynamic = "force-dynamic"
import AccountsPage from '@/components/accounts/AccountsPage'
export default function page() {
  return (
    <div className='bg-white rounded relative -mt-16 shadow px-2 pt-6'>
      <AccountsPage/>
    </div>
  )
}
