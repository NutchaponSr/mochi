"use client";

import { Button } from "@/components/ui/button";
import { useCRPC } from "@/lib/crpc";
import { useMutation, useQuery } from "@tanstack/react-query";

const Page = () => {
  const crpc = useCRPC();

  const { data: users, isPending } = useQuery(
    crpc.user.list.queryOptions({ limit: 10 }),
  );

  const createUser = useMutation(crpc.user.create.mutationOptions());

  return (
    <div className="min-h-screen flex justify-center items-center w-full">
      <Button
        onClick={() =>
          createUser.mutate({ name: "Pond", email: "pondpopza5@gmail.com" })
        }
      >
        Create User
      </Button>
      <pre className="text-xs">{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default Page;
