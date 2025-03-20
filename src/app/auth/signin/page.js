"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth-form";

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (e, setIsLoading, setError) => {
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (response?.error) {
      setError("Invalid credentials");
      setIsLoading(false);
      return;
    }

    router.replace("/todos");
  };

  return <AuthForm type="signin" onSubmit={handleSubmit} />;
}
