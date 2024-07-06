import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const page = () => {
  return (
    <section>
      <div
        className="
            pt-10
            h-[600px] 
          flex 
          justify-center w-full 
          items-center
           text-black 
          text-[30px]
          font-[25px]
          font-serif"
      >
        <Skeleton
          className="h-[600px] 
            w-screen 
            rounded-xl 
            flex justify-center 
            items-center"
        >
          In Development...
        </Skeleton>
      </div>
    </section>
  );
};

export default page;
