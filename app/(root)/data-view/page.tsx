"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/DataTable";
import { api } from "@/convex/_generated/api";
import { FundInfoTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTableControlPart from "@/components/controlPanel/DataTableControlPart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  const [data, setData] = useState<FundInfoTable[]>();
  const fundInforData = useQuery(api.fundInfo.getAllFundInfo);
  const router = useRouter();

  const columns: ColumnDef<FundInfoTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fund_id",
      header: "Fund ID",
      cell: ({ row }) => (
        <div className="w-[60px]">{row.getValue("fund_id")}</div>
      ),
    },
    {
      accessorKey: "avatar_url",
      header: "Logo",
      cell: ({ row }) => (
        <div>
          <img
            src={row.getValue("avatar_url")}
            alt="logo"
            style={{ width: 40, height: 40 }}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap">
                {row.getValue("name")}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{row.getValue("name")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "short_name",
      header: "Short Name",
      cell: ({ row }) => (
        <div className="capitalize text-blue-700">
          {row.getValue("short_name")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className=" ">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "fund_url",
      header: "Website Link",
      cell: ({ row }) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={row.getValue("fund_url")}
          className="flex cursor-pointer text-blue-600 underline"
        >
          Visit
        </Link>
      ),
    },
    {
      accessorKey: "fund_type",
      header: "Type",
      cell: ({ row }) => <div className="">{row.getValue("fund_type")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                Re-Sync data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/data-view/${row?.original?.fund_id}`)
                }
                className="cursor-pointer"
              >
                Fund Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    if (fundInforData && fundInforData.length > 0) {
      setData(fundInforData);
    }
  }, [fundInforData]);

  return (
    <section>
      <div>
        {data ? (
          <DataTable data={data ?? []} columns={columns} />
        ) : (
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
              Loading...
            </Skeleton>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
