import { ForgetPasswordView } from "@/modules/auth/ui/views/forget-password-view";

const Page = () => {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>
      <ForgetPasswordView />
    </>
  )
}

export default Page;