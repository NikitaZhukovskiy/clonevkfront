"use client"

import Link from "next/link"
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import authStore from "@/stores/AuthStore" // проверь путь к файлу

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === '/'
  const isRegisterPage = pathname === '/register'
  const isDashboard = pathname === '/dashboard'

  const handleLogout = () => {
    authStore.logout()
    router.push('/')
  }

  let buttonText = ''
  let buttonHref = ''

  if (isRegisterPage) {
    buttonText = 'Входи-входи'
    buttonHref = '/'
  } else if (isDashboard) {
    buttonText = 'Выход'
  } else if (isLoginPage) {
    buttonText = 'Кем будешь?'
    buttonHref = '/register'
  }

  return (
    <header className="h-[100px] w-full bg-white shadow-sm flex items-center justify-between pr-4">
      <div className="flex items-center">
        <div className="relative h-[125px] w-[125px] -mr-3">
          <Image
            src="/images/logo.svg"
            fill
            alt="CloneVk"
            className="object-contain"
            priority
          />
        </div>
        <input
          type="text"
          placeholder="Поиск"
          className="bg-gray-100 rounded-full px-4 text-sm w-[600px] h-[40px]"
        />
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="#">Друзья</Link>
          <Link href="#">Группы</Link>
          <Link href="#">Сообщения</Link>
          <Link href="#">Лента</Link>
        </nav>
        {isDashboard ? (
          <button
            onClick={handleLogout}
            className="w-[192px] h-[32px] bg-blue-500 text-white text-sm rounded-lg flex items-center justify-center"
          >
            {buttonText}
          </button>
        ) : (
          <Link
            href={buttonHref}
            className="w-[192px] h-[32px] bg-blue-500 text-white text-sm rounded-lg flex items-center justify-center"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </header>
  )
}
