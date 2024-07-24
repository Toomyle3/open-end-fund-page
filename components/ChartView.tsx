"use client";
import { api } from "@/convex/_generated/api";
import { FundData } from "@/types";
import { useQuery } from "convex/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DrawChart from "./DrawChart";
import { Skeleton } from "./ui/skeleton";

const ChartView: React.FC = () => {
  const dataTable = useQuery(api.funds.getAllFunds)?.map(
    ({ _creationTime, _id, Date, ...rest }): FundData => {
      const date = moment(Date.toString()).unix();
      const values = Object.entries(rest).reduce<Record<string, number>>(
        (acc, [key, value]) => {
          if (value !== "") {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              acc[key] = numValue;
            }
          }
          return acc;
        },
        {}
      );

      return {
        date,
        ...values,
      } as FundData;
    }
  );
  const [data, setData] = useState<FundData[] | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    if (
      dataTable &&
      dataTable.length > 0 &&
      JSON.stringify(dataTable) !== JSON.stringify(data)
    ) {
      setData(dataTable);
    }
  }, [data, dataTable]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className={`w-full justify-center text-center flex flex-col ${
        windowWidth && windowWidth > 550
          ? "pl-[20px] pr-[20px] pb-[60px] pt-[60px]"
          : "pl-0 pr-0"
      }`}
    >
      <div className="flex justify-center pb-10">
        <h1 className="text-[30px] text-gray-600 font-[600] font-serif">
          Performance dashboard of open-ended funds in Vietnam
        </h1>
      </div>
      <div className="flex justify-center flex-col">
        {data && data.length > 0 ? (
          <DrawChart chartData={data} screenWidth={windowWidth as number} />
        ) : (
          <div className="pt-10 h-[600px] flex justify-center w-full items-center text-black text-[30px] font-[25px] font-serif">
            <Skeleton className="h-[600px] w-screen rounded-xl flex justify-center items-center">
              Loading...
            </Skeleton>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartView;
