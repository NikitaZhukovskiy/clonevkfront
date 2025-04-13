import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/header/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <AuthForm />
      </div>
    </>
  );
}
