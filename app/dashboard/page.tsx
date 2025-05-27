"use client"

import { getCookie } from "cookies-next"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie("accessToken")
    if (!token) {
      router.push("/")
    }
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Поздравляем, ты вошел!</h1>
      <p className="text-lg text-gray-600">Теперь можно продолжать пользоваться платформой.</p>
    </div>
  )
}
