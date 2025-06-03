"use client"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      router.push('/dashboard');
    }
  }, []);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}