import { VerifyView } from "@/modules/auth/ui/views/verify-view";

const Page = async () => {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification email to your inbox. Please click the link to verify your email.
        </p>
      </div>

      <VerifyView />
    </>
  );
}

export default Page;