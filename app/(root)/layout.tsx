import SideBar from "@/components/SideBar";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex pb-20">
        <section className="flex min-h-screen flex-1 flex-col pl-[20px] overflow-auto">
          <div className="flex w-full flex-col">
            <div
              className="gap-2 flex h-16 
            items-center justify-between"
            >
              <SideBar />
              <Link href="/" className="flex cursor-pointer">
                <Image
                  src="/icons/logo.jpg"
                  alt="logo"
                  width={40}
                  height={40}
                  className="rounded-[50%]"
                />
              </Link>
              <div></div>
            </div>
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
