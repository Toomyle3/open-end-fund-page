"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { z } from "zod";
import "./index.css";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

import { Input } from "./ui/input";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
interface FormData {
  initialValue: string;
  annualRate: string;
  compoundingFrequency: string;
  investTime: string;
  payment: string;
}

interface ResultItem {
  year: number;
  value: number;
  investment: number;
  interest: number;
  endValue: number;
}

const formSchema = z.object({
  initialValue: z.string().transform((val) => Number(val)),
  annualRate: z.string().transform((val) => Number(val)),
  compoundingFrequency: z.string().transform((val) => Number(val)),
  investTime: z.string().transform((val) => Number(val)),
  payment: z.string().transform((val) => Number(val)),
});

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const BudgetPlanning = () => {
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialValue: "1000",
      annualRate: "10",
      compoundingFrequency: "1",
      investTime: "10",
      payment: "0",
    },
  });
  const t = useTranslations("BudgetPlanning");
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];
  function calculateResults(data: FormData) {
    const results = [];
    const pmt = parseInt(data.payment);
    const P = parseFloat(data.initialValue);
    const r = parseFloat(data.annualRate) / 100;
    const t = parseInt(data.investTime);
    const n = parseInt(data.compoundingFrequency);
    let previousA = P;

    for (let i = 1; i <= t; i++) {
      const A =
        P * Math.pow(1 + r / n, n * i) +
        (pmt * (Math.pow(1 + r / n, n * i) - 1)) / (r / n);

      results.push({
        year: i,
        value: previousA,
        investment: pmt,
        interest: r * 100,
        endValue: A,
      });
      previousA = A;
    }

    return results;
  }

  async function onSubmit(data: FormData) {
    try {
      const calculatedResults = calculateResults(data);
      setResults(calculatedResults);
    } catch (error) {
      console.log(error);
    }
  }

  const BudgetChart: React.FC<{ data: ResultItem[] }> = ({ data }) => {
    return (
      <ChartContainer config={chartConfig}>
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            label={{ value: t("Year"), position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{
              value: t("Million VND"),
              angle: -90,
              position: "insideBottom",
            }}
          />
          <ChartTooltip content={<ChartTooltipContent nameKey="endValue" />} />
          <Bar
            dataKey="endValue"
            fill="#4B5563"
            name={`${t("Million VND")}:`}
            label="year"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    );
  };

  const SummaryTable: React.FC<{ data: ResultItem[] }> = ({ data }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedData = showAll ? data : data.slice(0, 10);
    return (
      <div className="flex justify-center flex-col items-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Year")}</TableHead>
              <TableHead>{t("Start Value")}</TableHead>
              <TableHead>{t("Investment")}</TableHead>
              <TableHead>{t("Interest")}</TableHead>
              <TableHead>{t("End Value")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.map((item) => (
              <TableRow key={item.year}>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.value.toFixed(1)}</TableCell>
                <TableCell>{item.investment.toFixed(1)}</TableCell>
                <TableCell>{item.interest.toFixed(1) + "%"}</TableCell>
                <TableCell>{item.endValue.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!showAll && data.length > 10 && (
          <button
            onClick={() => setShowAll(true)}
            style={{
              borderBottom: "1px solid text-gray-600",
              textDecoration: "underline",
            }}
            className={`hover:text-red-800 mt-4 text-gray-600 ${currentLocale !== "vi" ? "font-serif" : "font-mono"} 
            text-[15px] font-[600]`}
          >
            {t("See More")}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1000px] flex flex-col justify-center items-center">
      <h1
        className={`text-[30px] w-full flex justify-center pt-[60px] pb-[60px] text-gray-600 font-[600] ${currentLocale !== "vi" ? "font-mono" : "${?'font-serif' : 'font-mono'}"}`}
      >
        {t("Budget Planning Tool")}
      </h1>
      <Tabs defaultValue="future" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="future" className="font-black">
            {t("Future Value Formula")}
          </TabsTrigger>
          <TabsTrigger
            value="drawdown"
            disabled
            className="font-black cursor-not-allowed"
          >
            {t("Max Draw-Down Formula")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="future">
          <Card>
            <CardHeader>
              <CardTitle className="font-black">
                {t("Future value of an investment")}
              </CardTitle>
              <CardDescription
                className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"}`}
              >
                {t("description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 md:grid md:grid-cols-2 w-full flex flex-col gap-[15px]"
                >
                  <FormField
                    control={form.control}
                    name="initialValue"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-[5px]">
                        <FormLabel
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          {t("Initial Investment:")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100000}
                            className="inputStyles w-full"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
                        <div
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          {t("mil VND")}
                        </div>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="annualRate"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-4">
                        <FormLabel
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                          whitespace-nowrap
                       font-[500]`}
                        >
                          {t("Annual Interest Rate:")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={1000}
                            className="inputStyles"
                            placeholder="Annual rate"
                            {...field}
                          />
                        </FormControl>
                        <div
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          %
                        </div>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compoundingFrequency"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-4">
                        <FormLabel
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          {t("Compounding Frequency:")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            className="inputStyles"
                            placeholder="Compounding frequency"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="investTime"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-4">
                        <FormLabel
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          {t("Investing Time:")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={200}
                            className="inputStyles"
                            placeholder="Investing time"
                            {...field}
                          />
                        </FormControl>
                        <div
                          className="text-[18px]
                       whitespace-nowrap
                    font-[500] ${?'font-serif' : 'font-mono'}"
                        >
                          {t("Years")}
                        </div>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-4">
                        <FormLabel
                          className={`${currentLocale !== "vi" ? "font-serif" : "font-mono"} text-[18px]
                        whitespace-nowrap
                     font-[500]`}
                        >
                          {t("Payment Amount:")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100000}
                            className="inputStyles"
                            placeholder="Payment amount"
                            {...field}
                          />
                        </FormControl>
                        <div
                          className="text-[18px]
                       whitespace-nowrap
                    font-[500] ${?'font-serif' : 'font-mono'}"
                        >
                          {t("mil VND/month")}
                        </div>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="${?'font-serif' : 'font-mono'} mt-[30px]"
                onClick={form.handleSubmit(onSubmit)}
              >
                {t("Calculate Total Accumulated Amount")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="drawdown">
          <Card>{t("Nothing")}</Card>
        </TabsContent>
      </Tabs>
      <div className="w-full">
        {results && (
          <Card className="mt-8">
            <CardHeader className="mb-6">
              <CardDescription className="text-[16px] ${?'font-serif' : 'font-mono'}">
                {t("Great! After")} {results[results.length - 1].year}{" "}
                {t("quote")} {results[results.length - 1].endValue.toFixed(2)}{" "}
                {t("million VND which is")}~{" "}
                {(
                  (results[results.length - 1].endValue * 100) /
                  parseInt(form.watch("initialValue"))
                ).toFixed(0)}
                % .
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row gap-8">
              <div className="w-full">
                <h3 className="text-[16px] font-[600] mb-4">
                  {t("ASSET VALUE OVER TIME")}
                </h3>
                <BudgetChart data={results} />
              </div>
              <div className="w-full">
                <h3 className="text-[16px] font-[600] mb-4">
                  {t("INVESTMENT DETAILS (Million VND)")}
                </h3>
                <SummaryTable data={results} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanning;
