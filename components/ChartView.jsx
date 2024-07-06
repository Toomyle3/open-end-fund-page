"use client";
import {
  defaultFunds,
  fund_types,
  funds_info,
  zoom_periods,
} from "@/constants";
import { api } from "@/convex/_generated/api";
import exportIcon from "@/public/icons/export-icon.svg";
import { useQuery } from "convex/react";
import * as d3 from "d3";
import { saveAs } from "file-saver";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import DrawChart from "./DrawChart";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { CSVLink } from "react-csv";

const ChartView = () => {
  // Hooks
  const timeParse = d3.timeParse("%Y-%m-%d");
  const dataTable = useQuery(api.funds.getAllFunds)?.map(
    ({ _creationTime, _id, Date, ...rest }) => ({
      ...rest,
      Date: Date,
      date: timeParse(Date),
    })
  );

  // States
  const [data, setData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isNavSelected, setIsNavSelected] = useState(false);
  const [selectedFunds, setSelectedFunds] = useState(defaultFunds);
  const selected_date = getDateRangeFromText(selectedPeriod);
  const [selectedData, setSelectedData] = useState([]);

  // chart values
  const y_columns = 4;
  const width_legend_col =
    windowWidth > 450
      ? windowWidth / y_columns - 20
      : windowWidth / y_columns - 5;
  const x_nticks = 6;
  const y_nticks = 4;
  const r_tooltips_item = 4;

  // data handler
  function getDateRangeFromText(rangeText) {
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = rangeText.match(dateRegex);
    return dates ? [Date.parse(dates[0]), Date.parse(dates[1])] : [null, null];
  }

  const csvData = useMemo(() => {
    if (
      !selected_date ||
      selected_date.length === 0 ||
      !selectedFunds ||
      selectedFunds.length === 0 ||
      !data ||
      data.length === 0
    ) {
      return;
    }

    const [startDate, endDate] = selected_date;
    const headerWithDate = ["Date", ...selectedFunds];

    const isValidDateRange = (date) =>
      Date.parse(date) >= startDate && Date.parse(date) <= endDate;

    const filteredData = (
      selectedData && selectedData.length > 0 ? selectedData : data
    ).filter(
      (fund) =>
        isValidDateRange(fund.Date) && selectedFunds.some((key) => key in fund)
    );

    const rows = filteredData.map((row) =>
      headerWithDate.map((fund) => row[fund])
    );

    return [headerWithDate, ...rows];
  }, [data, selected_date, selectedFunds, selectedData]);

  // Use Effect
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
    if (data && data?.length > 0) {
      const defaultData = data
        ?.filter((fund) =>
          Object.keys(fund).some((key) => selectedFunds.includes(key))
        )
        .filter(
          (fund) =>
            Date.parse(fund.Date) <= selected_date[1] &&
            Date.parse(fund.Date) >= selected_date[0]
        );
      setSelectedData(defaultData);
    }
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
        windowWidth > 550
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
        {data && data?.length > 0 ? (
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
                {isNavSelected ? (
                  <Label className="font-[500] text-[16px] font-serif">
                    Net asset value
                  </Label>
                ) : (
                  <Label className="font-[500] text-[16px] font-serif">
                    % value
                  </Label>
                )}
              </div>
            </div>
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
            <div className="flex justify-center pt-10">
              <CSVLink
                data={csvData}
                filename={`fund_nav_data.csv`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Export CSV
              </CSVLink>
            </div>
          </>
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

export default ChartView;
