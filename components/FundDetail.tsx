"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig
} from "@/components/ui/chart";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
// import { CSVLink } from "react-csv";
import moment from "moment";

interface ChartData {
  date: string;
  nav: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FundDetail() {
  const [data, setData] = React.useState<any>();
  const [chartData, setChartData] = React.useState<ChartData[]>();
  const [fromDate, setFromDate] = React.useState<any>(null);
  const [currentFund, setCurrentFund] = React.useState<any>();

  const fundInforData = useQuery(api.fundInfo.getAllFundInfo);
  const fundId = window.location.pathname?.split("/")[2];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.fmarket.vn/res/product/get-nav-history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isAllData: fromDate ? 0 : 1,
              productId: fundId,
              fromDate: fromDate,
              toDate: moment().format("YYYYMMDD"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChartData(
          data?.data?.map((item: any) => ({
            date: item?.navDate,
            nav: item?.nav,
          }))
        );
        setData(
          data?.data?.map((item: any) => ({
            id: item?.id,
            createAt: item?.createAt,
            productId: item?.productId,
            date: item?.navDate,
            marketvalue: item?.nav,
            value: item?.nav,
          }))
        );
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [fundId, currentFund, fromDate]);

  useEffect(() => {
    if (fundInforData) {
      setCurrentFund(
        fundInforData?.find((fund: any) => fund.fund_id == fundId)
      );
    }
  }, [fundInforData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-start gap-3 items-center">
          <img
            src={currentFund?.avatar_url}
            alt="logo"
            style={{ width: 40, height: 40 }}
          />
          {currentFund?.short_name}
        </CardTitle>
        <CardDescription
          className="text-blue-700 cursor-pointer font-[500]"
          onClick={() => window.open(currentFund?.fund_url, "_black")}
        >
          {currentFund?.fund_url}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
