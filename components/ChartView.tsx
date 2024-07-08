"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { CSVLink } from "react-csv";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  defaultFunds,
  fund_types,
  funds_info,
  zoom_periods,
} from "@/constants";
import DrawChart from "./DrawChart";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

interface FundData {
  Date: string;
  date: Date | null;
  [key: string]: any;
}

const ChartView: React.FC = () => {
  const timeParse = d3.timeParse("%Y-%m-%d");
  const dataTable = useQuery(api.funds.getAllFunds)?.map(
    ({ _creationTime, _id, Date, ...rest }): FundData => ({
      ...rest,
      Date,
      date: timeParse(Date),
    })
  );

  const [data, setData] = useState<FundData[] | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [isNavSelected, setIsNavSelected] = useState<boolean>(false);
  const [selectedFunds, setSelectedFunds] = useState<string[]>(defaultFunds);
  const [selectedData, setSelectedData] = useState<FundData[]>([]);

  const y_columns = 4;
  const width_legend_col = windowWidth
    ? windowWidth > 450
      ? windowWidth / y_columns - 20
      : windowWidth / y_columns - 5
    : 0;
  const x_nticks = 6;
  const y_nticks = 4;
  const r_tooltips_item = 4;

  const selected_date: [number | null, number | null] = useMemo(() => {
    const range = getDateRangeFromText(selectedPeriod);
    return range.length === 2 ? range : [null, null];
  }, [selectedPeriod]);

  function getDateRangeFromText(
    rangeText: string
  ): [number | null, number | null] {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = rangeText.match(dateRegex);
    return dates ? [Date.parse(dates[0]), Date.parse(dates[1])] : [null, null];
  }

  const csvData = useMemo(() => {
    if (
      !selected_date ||
      selected_date.length !== 2 ||
      !selectedFunds ||
      selectedFunds.length === 0 ||
      !data ||
      data.length === 0
    ) {
      return;
    }

    const [startDate, endDate] = selected_date;
    const headerWithDate = ["Date", ...selectedFunds];

    const isValidDateRange = (date: string) =>
      startDate !== null &&
      endDate !== null &&
      Date.parse(date) >= startDate &&
      Date.parse(date) <= endDate;

    const filteredData = (selectedData.length > 0 ? selectedData : data).filter(
      (fund) =>
        isValidDateRange(fund.Date) && selectedFunds.some((key) => key in fund)
    );

    const rows = filteredData.map((row) =>
      headerWithDate.map((fund) => row[fund])
    );

    return [headerWithDate, ...rows];
  }, [data, selected_date, selectedFunds, selectedData]);

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
    if (
      data &&
      data.length > 0 &&
      selected_date[0] !== null &&
      selected_date[1] !== null
    ) {
      const defaultData = data
        .filter((fund) =>
          Object.keys(fund).some((key) => selectedFunds.includes(key))
        )
        .filter(
          (fund) =>
            Date.parse(fund.Date) <= selected_date[1]! &&
            Date.parse(fund.Date) >= selected_date[0]!
        );
      setSelectedData(defaultData);
    }
  }, [data, selected_date, selectedFunds]);

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
          ? "pl-[40px] pr-[20px] pb-[60px] pt-[60px]"
          : "pl-[5px] pr-[5px]"
      }`}
    >
      <div className="flex justify-center pb-10">
        <h1 className="text-[30px] text-gray-600 font-[600] font-serif">
          Performance dashboard of open-ended funds in Vietnam
        </h1>
      </div>
      <div className="flex justify-center flex-col">
        {data && data.length > 0 ? (
          <>
            <div className="flex flex-col justify-center sm:flex-row gap-5 sm:justify-between items-center pl-[55px] pr-[20px]">
              <div className="flex gap-5">
                <h4 className="font-[600] text-[16px] font-serif">
                  Chart Type
                </h4>
                <Switch
                  id="chart-type"
                  onCheckedChange={(value) => {
                    setIsNavSelected(value);
                  }}
                />
                <Label className="font-[500] text-[16px] font-serif">
                  {isNavSelected ? "Net asset value" : "% value"}
                </Label>
              </div>
            </div>
            <DrawChart
              fund_types={fund_types}
              funds_info={funds_info}
              zoom_periods={zoom_periods}
              width_legend_col={width_legend_col}
              x_nticks={x_nticks}
              y_nticks={y_nticks}
              r_tooltips_item={r_tooltips_item}
              chartData={data}
              setSelectedFunds={setSelectedFunds}
              setSelectedPeriod={setSelectedPeriod}
              setSelectedData={setSelectedData}
              windowWidth={windowWidth}
              isNavSelected={isNavSelected}
            />
            <div className="flex justify-center pt-10">
              <CSVLink
                data={csvData || []}
                filename="fund_nav_data.csv"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Export CSV
              </CSVLink>
            </div>
          </>
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
