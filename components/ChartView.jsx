"use client";
import {
  defaultFunds,
  fund_types,
  funds_info,
  zoom_periods,
} from "@/constants";
import exportIcon from "@/public/icons/export-icon.svg";
import { SignedIn, useClerk } from "@clerk/nextjs";
import * as d3 from "d3";
import { saveAs } from "file-saver";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DrawChart from "./DrawChart";
import "./index.css";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const ChartView = () => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(null);
  const [isNavSelected, setIsNavSelected] = useState(false);
  const { signOut } = useClerk();
  const [selectedFunds, setSelectedFunds] = useState(defaultFunds);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const selected_date = getDateRangeFromText(selectedPeriod);
  const filteredData = data?.filter(
    (d) =>
      Date.parse(d.Date) >= selected_date[0] &&
      Date.parse(d.Date) <= selected_date[1]
  );
  const [selectedData, setSelectedData] = useState([]);
  function getDateRangeFromText(rangeText) {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = rangeText.match(dateRegex);
    return dates ? [Date.parse(dates[0]), Date.parse(dates[1])] : [null, null];
  }

  const y_columns = 4;
  const width_legend_col =
    windowWidth > 450
      ? windowWidth / y_columns - 20
      : windowWidth / y_columns - 5;
  const x_nticks = 6;
  const y_nticks = 4;
  const r_tooltips_item = 4;

  const handleDownloadCsv = () => {
    if (
      !selected_date ||
      selected_date?.length === 0 ||
      !selectedFunds ||
      selectedFunds.length === 0 ||
      !selectedData ||
      selectedData.length === 0
    ) {
      return;
    }
    const headerWithDate = ["Date", ...selectedFunds];
    const filteredData = selectedData?.filter(
      (fund) =>
        Date.parse(fund?.Date) <= selected_date[1] &&
        Date.parse(fund?.Date) >= selected_date[0]
    );
    const headers = headerWithDate.join(",");
    const rows = filteredData.map((row) => {
      return headerWithDate.map((fund) => row[fund]).join(",");
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "export.csv");
  };

  useEffect(() => {
    d3.csv("/data.csv").then((rawData) => {
      const timeParse = d3.timeParse("%Y-%m-%d");
      const parsedData = rawData.map((d) => {
        return {
          ...d,
          date: timeParse(d.Date),
        };
      });
      setData(parsedData);
    });
  }, []);

  useEffect(() => {
    setSelectedData(filteredData);
  }, [data]);

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
        windowWidth > 450
          ? "pl-[40px] pr-[20px] pb-[60px] pt-[60px]"
          : "pl-[5px] pr-[5px]"
      }`}
    >
      <div>
        <SignedIn>
          <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
            <Button
              className="text-16 w-[200px] bg-gray-700 text-white font-extrabold logout-btn"
              onClick={() => signOut(() => router.push("/sign-in"))}
            >
              Log Out
            </Button>
          </div>
        </SignedIn>
      </div>
      <div className="flex justify-center pb-10">
        <h1 className="text-[40px] text-gray-600 font-[600] font-serif">
          Performance dashboard of open-ended funds in Vietnam
        </h1>
      </div>
      <div className="flex flex-col justify-center sm:flex-row gap-5 sm:justify-between items-center pl-[55px] pr-[20px]">
        <div className="flex gap-5">
          <h4 className="font-[600] text-[16px] font-serif">Chart Type</h4>
          <Switch
            id="chart-type"
            onCheckedChange={(value) => {
              setIsNavSelected(value);
            }}
          />
          {isNavSelected ? (
            <Label className="font-[500] text-[16px] font-serif">
              Net asset value
            </Label>
          ) : (
            <Label className="font-[500] text-[16px] font-serif">% value</Label>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        {data && data?.length > 0 ? (
          <DrawChart
            // Chart ratio
            fund_types={fund_types}
            funds_info={funds_info}
            zoom_periods={zoom_periods}
            width_legend_col={width_legend_col}
            x_nticks={x_nticks}
            y_nticks={y_nticks}
            r_tooltips_item={r_tooltips_item}
            // Csv data
            chartData={data}
            // CSV export data collection
            setSelectedFunds={setSelectedFunds}
            setSelectedPeriod={setSelectedPeriod}
            setSelectedData={setSelectedData}
            windowWidth={windowWidth}
            isNavSelected={isNavSelected}
          />
        ) : (
          <div className="h-[400px] flex justify-center w-full items-center">
            loading...
          </div>
        )}
      </div>
      <div className="flex justify-center pt-10">
        <Button
          className="w-[180px] h-[40px] flex gap-2"
          onClick={handleDownloadCsv}
        >
          <Image src={exportIcon} width={20} height={20} alt="export" />
          Export CSV
        </Button>
      </div>
    </section>
  );
};

export default ChartView;
