"use client";
import {
  defaultFunds,
  fund_types,
  funds_info,
  zoom_periods,
} from "@/constants";
import * as d3 from "d3";
import DrawChart from "./DrawChart";
import { useEffect, useState } from "react";
import "./index.css";

const ChartView = () => {
  const [data, setData] = useState(null);
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
  const width_legend_col = window.innerWidth / y_columns - 20;
  const x_nticks = 6;
  const y_nticks = 4;
  const r_tooltips_item = 4;

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
    if (
      selectedFunds.length === defaultFunds.length &&
      selectedFunds.every((fund, index) => fund === defaultFunds[index])
    ) {
      setSelectedData(filteredData);
    }
  }, [data]);

  const handleDownloadCsv = () => {};

  return (
    <section className="w-full justify-center flex flex-col p-[40px]">
      <div className="flex justify-center pb-10">
        <h1 className="text-[40px] text-gray-600 font-[600] font-serif">
          Performance dashboard of open-ended funds in Vietnam
        </h1>
      </div>
      <div className="flex justify-center">
        {data && (
          <DrawChart
            // chart ratio
            fund_types={fund_types}
            funds_info={funds_info}
            zoom_periods={zoom_periods}
            width_legend_col={width_legend_col}
            x_nticks={x_nticks}
            y_nticks={y_nticks}
            r_tooltips_item={r_tooltips_item}
            // csv data
            chartData={data}
            // colect data for export csv
            setSelectedFunds={setSelectedFunds}
            setSelectedPeriod={setSelectedPeriod}
            setSelectedData={setSelectedData}
          />
        )}
      </div>
      <div className="flex justify-center pt-10">
        <button
          className="button-style border border-l-2 w-[200px] h-[40px] rounded bg-green-500 text-white"
          onClick={handleDownloadCsv}
        >
          Export CSV
        </button>
      </div>
    </section>
  );
};

export default ChartView;
