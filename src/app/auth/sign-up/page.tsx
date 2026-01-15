
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

const Page = () => {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome to Echo</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to your account to continue
        </p>
      </div>
      <SignUpView />
    </>
  );
}

export default Page;