"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const ResetPasswordView = ({ token }: { token: string }) => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsPending(false);
      return;
    }

    await authClient.resetPassword({
      newPassword,
      token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.push("/auth/sign-in");
        }
      },
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>New Password</Label>
            <Input 
              required
              type="password"
              value={newPassword}
              disabled={isPending}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Confirm Password</Label>
            <Input 
              required
              type="password"
              value={confirmPassword}
              disabled={isPending}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={isPending}>Continue</Button>
        </div>
      </div>
    </form>
  )
}