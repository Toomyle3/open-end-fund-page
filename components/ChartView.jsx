"use client";
import { fund_types, funds_info, zoom_periods } from "@/constants";
import * as d3 from "d3";
import DrawChart from "./DrawChart";
import { useEffect, useState } from "react";

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

  return (
    <section className="w-full justify-center flex flex-col p-[40px]">
      <div>
        <h1 className="text-[25px]">
          Performance dashboard of open-ended funds in Vietnam
        </h1>
      </div>
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
    </section>
  );
};

export default ChartView;
