import { Suspense } from 'react'
import MainMenuClient from './MainMenuClient'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainMenuClient />
    </Suspense>
  )
}
