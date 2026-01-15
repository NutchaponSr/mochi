import { ResetPasswordView } from "@/modules/auth/ui/views/reset-password-view";

interface Props {
  searchParams: Promise<{ token: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password
        </p>
      </div>
      <ResetPasswordView token={token} />
    </>
  )
}

export default Page;