export const dynamic = "force-dynamic"

import CategoriesPage from "@/components/categories/CategoriesPage";

export default function page() {
  return (
    <div className='bg-white rounded relative -mt-16 shadow px-2 pt-6'>
      <CategoriesPage/>
    </div>
  )
}
