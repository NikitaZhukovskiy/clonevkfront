import Navbar from "@/components/header/Navbar";
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <RegisterForm />
    </div>
    </>
  );
}
