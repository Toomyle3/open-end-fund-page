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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import "./index.css";

const formSchema = z.object({
  initialValue: z.number().min(2),
  annualRate: z.number().min(0),
  compoundingFrequency: z.number(),
  investTime: z.number().min(1),
  payment: z.number(),
});

const BudgetPlanning = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialValue: 0,
      annualRate: 0,
      compoundingFrequency: 1,
      investTime: 1,
      payment: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("in");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1
        className="text-[30px] w-full flex justify-center pt-[60px] 
        pb-[60px] text-gray-600 font-[600] 
        font-serif"
      >
        Budget Planning Tool
      </h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="future" className="font-black">
            Future Value Formula
          </TabsTrigger>
          <TabsTrigger value="drawdown" className="font-black">
            Max Draw-Down Formula
          </TabsTrigger>
        </TabsList>
        <TabsContent value="future">
          <Card>
            <CardHeader>
              <CardTitle className="font-black">
                Future value of an investment
              </CardTitle>
              <CardDescription className="font-serif">
                The formula is the Future Value of an investment compounded
                periodically and includes periodic contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-2 sm:grid sm:grid-cols-2 w-full flex flex-col gap-[15px]"
                >
                  <FormField
                    control={form.control}
                    name="initialValue"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-[10px]">
                        <FormLabel
                          className="text-[18px]
                           whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Initial Investment:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles w-full"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
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
                          className="text-[18px] 
                          whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Annual Interest Rate:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
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
                          className="text-[18px] 
                          whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Compounding Frequency:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles"
                            placeholder="Initial investment"
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
                          className="text-[18px] 
                          whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Investing Time:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initialValue"
                    render={({ field }) => (
                      <FormItem className="flex sm:items-end flex-col items-center sm:flex-row sm:gap-4">
                        <FormLabel
                          className="text-[18px] 
                          whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Initial Investment:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
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
                          className="text-[18px] 
                          whitespace-nowrap
                        font-[500] font-serif"
                        >
                          Payment Amount:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="inputStyles"
                            placeholder="Initial investment"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white-1" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="font-serif">
                Calculate Total Accumulated Amount
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="drawdown">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* <div>
        <h1
          className="text-[30px] w-full pt-[60px] 
        pb-[60px] text-gray-600 font-[600] 
        font-serif"
        >
          Budget Planning Tool
        </h1>
        <div className="flex flex-col sm:flex-row w-full justify-between">
          <div className="max-w-[300px] font-serif font-[500] text-[28px]">
            Please fill in some basic information to calculate the accumulated
            amount when investing!
          </div>
          <div>
            
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default BudgetPlanning;
