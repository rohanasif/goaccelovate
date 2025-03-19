"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SignOutButton from "./sign-out-button";

export default function ProtectedLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="border-b">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <SignOutButton />
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
