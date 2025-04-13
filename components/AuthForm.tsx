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
    <form onSubmit={handleSubmit} className="space-y-4 w-[600px] h-[600px] bg-white p-8 rounded-3xl drop-shadow-xl">
      <div className="flex flex-col items-center mb-0">
        <Image
          src="/images/logo.svg"
          width={200}
          height={200}
          alt="CloneVk"
          className="object-contain"
        />
        <h1 className="text-2xl font-semibold mb-4">Вход</h1>
      </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-m bg-gray-50"
            value={email}
            placeholder="test@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Пароль</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-m bg-gray-50"
            value={password}
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="text-left">
          <a href="#" className="text-sm text-gray-500 hover:underline">
            Не помню пароль
          </a>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-[360px] h-[48px] bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
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
    </form>
  );
}
