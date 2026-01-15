"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  return (
    <Button 
      variant="outline" 
      onClick={() => authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/sign-in");
          },
        },
      })}
    >
      Sign out
    </Button>
  );
}