'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 데모 모드에서는 바로 데모 페이지로 리다이렉트
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      router.push('/demo')
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">헬스케어 B2B 플랫폼</h1>
        <p className="text-gray-600">데모 페이지로 이동 중...</p>
      </div>
    </main>
  )
}
