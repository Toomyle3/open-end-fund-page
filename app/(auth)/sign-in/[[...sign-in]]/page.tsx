import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex justify-center h-screen w-full items-center pb-20">
      <SignIn
        // appearance={{
        //   elements: {
        //     footer: "hidden",
        //   },
        // }}
      />
    </div>
  );
};

export default Page;
