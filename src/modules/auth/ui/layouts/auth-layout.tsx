export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background min-h-dvh min-w-80 p-4 justify-center items-center grid grid-cols-[minmax(0,440px)] grid-rows-[min-content_min-content_24px] content-between select-none">
      <div className="row-start-2 flex justify-start flex-col gap-6 pb-16 pt-4">
        {children}
      </div>
      <small className="row-start-3 leading-5 text-center text-sm">
        Terms of Service and Privacy Policy
      </small>
    </div>
  );
}
