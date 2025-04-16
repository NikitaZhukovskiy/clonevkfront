'use client'

import AuthForm from "@/components/AuthForm";
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const fromRegistration = searchParams.get('fromRegistration') === 'true'
  
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {fromRegistration && (
          <div className="flex max-w-md bg-white p-8 rounded-3xl shadow-lg -mt-39 mb-3">
            <div className="">
              <h2 className="text-2xl font-semibold text-green-600">Успешная регистрация!</h2>
              <p className="text-gray-700">
                Вы успешно зарегистрировались и теперь можете войти в систему.
              </p>
            </div>
          </div>
        )}
      
      <AuthForm />
    </div>
  );
}
