"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const Language = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handleValueChange = (value: string) => {
    const currentPathWithoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${value}/${currentPathWithoutLocale}`;
    router.push(newPath);
  };
  return (
    <Select onValueChange={handleValueChange} defaultValue="vi">
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi">Vietnamese</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default Language;
