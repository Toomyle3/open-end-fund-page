"use client";
import { api } from "@/convex/_generated/api";
import { FundData, FundeNavData } from "@/types";
import { useQuery } from "convex/react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import DrawChart from "./DrawChart";
import { Skeleton } from "./ui/skeleton";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getFundNav } from "@/services/fundService";
import { useDispatch } from "react-redux";

const ChartView: React.FC = () => {
  const [data, setData] = useState<any>([]);
  console.log(data);

  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const t = useTranslations("Home");
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFundNav(23);
      setData(
        response?.map((data) => {
          return {
            Date: data.navDate,
            VESAF: data.nav,
          };
        })
      );
    };
    fetchData();
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
        <h1
          className={`text-[30px] text-gray-600 
        ${currentLocale === "vi" ? "font-mono font-[700]" : "font-[600] font-serif"}`}
        >
          {t("title")}
        </h1>
      </div>
      <div className="flex justify-center flex-col">
        {data && data.length > 0 ? (
          <DrawChart chartData={data} screenWidth={windowWidth as number} />
        ) : (
          <div className="pt-10 h-[600px] flex justify-center w-full items-center text-black text-[30px] font-[25px] font-serif">
            <Skeleton className="h-[600px] w-screen rounded-xl flex justify-center items-center">
              {t("loading")}
            </Skeleton>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartView;
