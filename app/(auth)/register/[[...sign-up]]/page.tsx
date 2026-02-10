import LoginUi from '@/components/loginUi/loginUi'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className='flex justify-center'>
    <LoginUi Comp={<SignUp />}/>
  </div>
  )
}