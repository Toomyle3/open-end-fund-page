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
  ChartConfig,
  ChartContainer
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import moment from "moment";
import React, { useEffect } from "react";
import { CSVLink } from "react-csv";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
            date: moment(item?.navDate).format("YYYY-MM-DD"),
            nav: parseFloat(item?.nav),
          }))
        );
        setData(
          data?.data?.map((item: any) => ({
            id: item?.id,
            createAt: item?.createAt,
            productId: item?.productId,
            date: moment(item?.navDate).format("YYYY-MM-DD"),
            marketvalue: parseFloat(item?.nav),
            value: parseFloat(item?.nav),
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

  const handleMonthChange = (value: string) => {
    if (value === "all") {
      setFromDate(null);
    } else {
      setFromDate(moment().subtract(parseInt(value), "months").format("YYYYMMDD"));
    }
  };

  const csvData = React.useMemo(() => {
    if (!data) return [];
    return [
      ["Date", "NAV"],
      ...data.map((item: any) => [item.date, item.value]),
    ];
  }, [data]);

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
          onClick={() => window.open(currentFund?.fund_url, "_blank")}
        >
          {currentFund?.fund_url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => moment(value).format("MMM DD")}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => moment(value).format("YYYY-MM-DD")}
                formatter={(value: number) => [value.toFixed(2), "NAV"]}
              />
              <Line
                type="monotone"
                dataKey="nav"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 text-sm">
        <Select onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="12">12 Months</SelectItem>
            <SelectItem value="36">36 Months</SelectItem>
          </SelectContent>
        </Select>
        <CSVLink 
          data={csvData} 
          filename={`${currentFund?.short_name || 'fund'}_nav_data.csv`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Export CSV
        </CSVLink>
      </CardFooter>
    </Card>
  );
}