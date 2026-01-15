"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignInSocialMutationOptions, useSignUpMutationOptions } from "@/lib/auth-client";

export const SignUpView = () => {
  const router = useRouter();

  const provider = useMutation(useSignInSocialMutationOptions({
    onSuccess: () => {
      router.push("/");
    },
  }));

  const signUp = useMutation(useSignUpMutationOptions({
    onSuccess: () => {
      router.push("/");
    },
  }));
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPending, setIsPending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signUp.mutate({
      name,
      email,
      password,
      callbackURL: "/",
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
      } 
    });
  }

  const onProvider= (key: "google") => {
    provider.mutate({
      provider: key,
      callbackURL: window.location.origin,
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
            <Label>Username</Label>
            <Input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
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
          </div>
          <Button type="submit" disabled={isPending}>Continue</Button>
        </div>
      </div>

      <p className="text-sm mt-4 text-center">Already have an account? <Link href="/auth/sign-in" className="text-primary underline">Sign in</Link></p>
    </form> 
  );
}