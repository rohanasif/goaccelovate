"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/auth-form";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (e, setIsLoading, setError) => {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Something went wrong");
      setIsLoading(false);
      return;
    }

    // Sign in the user after successful registration
    const signInResponse = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (signInResponse?.error) {
      setError("Error signing in after registration");
      setIsLoading(false);
      return;
    }

    router.replace("/todos");
  };

  return <AuthForm type="register" onSubmit={handleSubmit} />;
}
