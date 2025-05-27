"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const isLoginPage = pathname === "/"
  const isRegisterPage = pathname === "/register"

  let buttonText = ""
  let buttonHref = ""

  if (isRegisterPage) {
    buttonText = "Входи-входи"
    buttonHref = "/"
  } else if (isLoginPage) {
    buttonText = "Кем будешь?"
    buttonHref = "/register"
  }

  return (
    <header className="h-[100px] w-full bg-white shadow-sm flex items-center justify-between pr-4">
      <div className="flex items-center">
        <div className="relative h-[125px] w-[125px] -mr-3">
          <Link href="/dashboard">
          <Image
            src="/images/logo.svg"
            fill
            alt="CloneVk"
            className="object-contain"
            priority
          />
          </Link>
        </div>
      </div>

      <div className="flex items-center mr-6">
        {isLoginPage || isRegisterPage ? (
          <Link
            href={buttonHref}
            className="w-[192px] h-[32px] bg-blue-500 text-white text-sm rounded-lg flex items-center justify-center"
          >
            {buttonText}
          </Link>
        ) : (
          <Link href="/profile">
            <Image
              src="https://i.pinimg.com/originals/ce/b8/c1/ceb8c155f441b7ca3cca7c17bc3a6f1e.jpg"
              width={100}
              height={100}
              alt="Профиль"
              className="rounded-full cursor-pointer object-cover"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
