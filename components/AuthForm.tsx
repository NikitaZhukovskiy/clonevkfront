"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import Image from 'next/image'
import Link from "next/link";

export default function AuthForm() {
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost:8083/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      console.error("Ошибка авторизации");
      return;
    }

    const data = await res.json()
    console.log("Успешный вход:", data)
    router.push("/dashboard")
  };

  return (
    <form onSubmit={handleSubmit} className="w-[470px] flex flex-col gap-6 bg-white p-6 rounded-3xl drop-shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="relative h-[168px] w-[168px] -mt-10 -mb-6">
          <Image
            src="/images/logo.svg"
            fill
            alt="CloneVk"
            className="object-contain"
            priority
            />
        </div>
        <h1 className="text-2xl font-semibold">Вход</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2 text-sm text-gray-600">
          <label>Email</label>
          <input
            type="email"
            className="w-full border border-gray-100 rounded-xl px-3 py-2 text-m bg-gray-50 text-gray-900"
            value={email}
            placeholder="test@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2 text-sm text-gray-600">
          <label>Пароль</label>
          <input
            type="password"
            className="w-full border border-gray-100 rounded-xl px-3 py-2 text-m bg-gray-50 text-gray-900"
            value={password}
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="text-left">
          <a href="#" className="text-sm text-gray-900 hover:underline">
            Не помню пароль
          </a>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-[360px] h-[48px] bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
          >
          Войти
          </button>
        </div>
        <p className="text-center text-sm">
          Еще нет аккаунта?{" "}
          <Link href="/register/" className="hover:underline">
            Регистрация
          </Link>
        </p>
      </div>
    </form>
  );
}
