"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Language = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const currentLocale = pathname.split("/")[1];
    setValue(currentLocale);
  }, [pathname]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    const currentPathWithoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${newValue}/${currentPathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <Select onValueChange={handleValueChange} value={value}>
      <SelectTrigger className="w-[150px]">
        <Image
          src="/images/translate.svg"
          width={30}
          height={30}
          alt="translate"
        />
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi">Vietnamese</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default Language;
