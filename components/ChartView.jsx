"use client";
import { fund_types, funds_info, zoom_periods } from "@/constants";
import * as d3 from "d3";
import DrawChart from "./DrawChart";
import { useEffect, useState } from "react";
import "./index.css";

const ChartView = () => {
  const [data, setData] = useState(null);
  const y_columns = 4;
  const width_legend_col = 110;
  const width_legend = width_legend_col * y_columns;

  // Number of ticks on axis
  const x_nticks = 6;
  const y_nticks = 4;
  const r_tooltips_item = 4;

  useEffect(() => {
    // Read the data
    d3.csv("/data.csv")
      .then((rawData) => {
        const timeParse = d3.timeParse("%Y-%m-%d");
        const parsedData = rawData.map((d) => {
          return {
            ...d,
            date: timeParse(d.Date),
          };
        });
        setData(parsedData);
      })
      .catch((error) => {
        console.error("Error loading the data: ", error);
      });
  }, []);

  const handleDownloadCsv = () => {
    
  };

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
            fund_types={fund_types}
            funds_info={funds_info}
            zoom_periods={zoom_periods}
            width_legend_col={width_legend_col}
            width_legend={width_legend}
            x_nticks={x_nticks}
            y_nticks={y_nticks}
            r_tooltips_item={r_tooltips_item}
            chartData={data}
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
