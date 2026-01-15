"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SignInView = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPending, setIsPending] = useState(false);

  const onProvider= async (provider: "google") => {
    await authClient.signIn.social({
      provider,
    });
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Button variant="outline" type="button" onClick={() => onProvider("google")}>
            <Image src="/google.svg" alt="Google" width={16} height={16} />
            Continue with Google
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <Link href="/auth/forget-password" className="text-xs text-muted-foreground">Forgot password?</Link>
          </div>
          <Button type="submit" disabled={isPending}>Continue</Button>
        </div>
      </div>

      <p className="text-sm mt-4 text-center">Don't have an account? <Link href="/auth/sign-up" className="text-primary underline">Sign up</Link></p>
    </form>
  );
}