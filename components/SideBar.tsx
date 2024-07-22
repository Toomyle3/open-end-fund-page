"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { SignedIn, useClerk } from "@clerk/clerk-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

const SideBar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();
  const t = useTranslations("SideBar");

  return (
    <section className="m-w-[300px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetTitle></SheetTitle>
        <SheetContent
          side="left"
          className="border-none bg-gray-700 max-w-[300px] overflow-auto"
        >
          <Link
            href="/"
            className="flex cursor-pointer justify-start items-center gap-1 pb-14 pl-[1rem]"
          >
            <Image
              src="/icons/logo.jpg"
              alt="logo"
              width={30}
              height={30}
              className="rounded-[50%]"
            />
            <h3 className="text-20 font-extrabold text-white ml-2">
              {t("title")}
            </h3>
          </Link>
          <div className="flex flex-col justify-between gap-[40px]">
            <SheetClose asChild>
              <nav className="nav-scroll flex flex-col h-[500px] overflow-auto gap-6 text-white">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive =
                    "/" + pathname.split("/")[2] === route ||
                    pathname.startsWith(`${route}/`);
                  return (
                    <SheetClose asChild key={route}>
                      <Link
                        href={route}
                        className={cn(
                          "flex gap-3 items-center py-4 px-4 justify-start",
                          {
                            "bg-nav-focus border-r-4 border-white": isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          width={20}
                          height={20}
                        />
                        <p className="text-sm">{t(label)}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
            <SignedIn>
              <div className="flex-center flex justify-center w-full">
                <Button
                  className="text-16 
                  w-[200px] bg-white 
                  rounded border 
                  font-extrabold logout-btn"
                  onClick={() => signOut(() => router.push("/sign-in"))}
                >
                  {t("logout")}
                </Button>
              </div>
            </SignedIn>
          </div>
        </SheetContent>
        <SheetDescription></SheetDescription>
      </Sheet>
    </section>
  );
};

export default SideBar;
