"use client";

import { Button } from "@/components/ui/button";
import { useSignOutMutationOptions } from "@/lib/auth-client";
import { useCRPC } from "@/lib/crpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const Page = () => {
  const crpc = useCRPC();
  const router = useRouter();
  const signOut = useMutation(useSignOutMutationOptions({
    onSuccess: () => {
      router.refresh();
    },
  }));

  const createOrg = useMutation(crpc.organization.create.mutationOptions());
  
  return (
    <div className="min-h-screen flex justify-center items-center w-full">
      <div className="flex flex-col gap-2">
        <Button onClick={() => createOrg.mutate({
          name: "My Organization",
          slug: "my-organization"
        })}>Create Organization</Button>
        <Button onClick={() => signOut.mutate()}>Sign Out</Button>
      </div>
    </div>
  );
};

export default Page;
