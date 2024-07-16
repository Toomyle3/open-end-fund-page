"use client";
import { defaultFunds, funds_info, PERIODS } from "@/constants";
import useResizable from "@/hooks/useChartResize";
import useExportCsv from "@/hooks/useExportCsv";
import { DrawChartProps, FundData } from "@/types";
import * as d3 from "d3";
import { format } from "date-fns";
import { ColorType, createChart, IChartApi, Time } from "lightweight-charts";
import { Expand } from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ChartController from "./drawChart/ChartController";
import FundController from "./drawChart/FundController";
import "./index.css";
import { Button } from "./ui/button";

const DrawChart: React.FC<DrawChartProps> = memo(
  ({ chartData, screenWidth }) => {
    // States
    const [data, setData] = useState<FundData[]>([]);
    const { resizeRef, chartWidth, chartHeight } = useResizable();
    const { handleExportCSV } = useExportCsv();
    const fundsByType: any = {};
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[6]);
    const [selectedFunds, setSelectedFunds] = useState<string[]>(defaultFunds);
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNavSelected, setIsNavSelected] = useState(false);
    const [dateRange, setDateRange] = useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({
      from: new Date(1621848890 * 1000),
      to: new Date(1716543290 * 1000),
    });

    // Refs
    const chartRef = useRef<IChartApi | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const colorScales = useMemo(
      () =>
        d3
          .scaleSequential(d3.interpolateRainbow)
          .domain([selectedFunds.length, 0]),
      [selectedFunds]
    );

    const filteredData = useMemo(() => {
      const now = Date.now() / 1000;
      let startDate: number;
      let endDate: number;

      if (dateRange && dateRange.from && dateRange.to) {
        startDate = dateRange.from.getTime() / 1000;
        endDate = dateRange.to.getTime() / 1000;
      } else {
        endDate = now;
        startDate = now - selectedPeriod.days * 24 * 60 * 60;
      }

      const selectedData = data
        .map((fund) => {
          const filteredFund: any = { date: fund.date };
          Object.keys(fund).forEach((key) => {
            if (selectedFunds.includes(key)) {
              filteredFund[key] = fund[key];
            }
          });
          return filteredFund;
        })
        .filter((fund) => Object.keys(fund).length > 1);

      return selectedData.filter((item) => {
        return item.date >= startDate && item.date <= endDate;
      });
    }, [data, dateRange, selectedPeriod, selectedFunds]);

    const handlePeriodSelect = (period: (typeof PERIODS)[number]) => {
      setSelectedPeriod(period);
      setDateRange({ from: undefined, to: undefined });
    };

    funds_info.forEach((fund: any) => {
      if (!fundsByType[fund.type]) {
        fundsByType[fund.type] = [];
      }
      fundsByType[fund.type].push(fund);
    });

    const handleDrawChart = useCallback(() => {
      if (!chartContainerRef.current) return;

      if (chartRef.current) {
        chartRef.current.remove();
        const tooltips = document.getElementsByClassName("tooltip-chart");

        Array.from(tooltips).forEach((tooltip) => {
          tooltip.remove();
        });
      }

      const chart = createChart(chartContainerRef.current, {
        width: chartWidth < 0 ? 0 : chartWidth,
        height: chartHeight < 0 ? 0 : chartHeight,
        layout: {
          textColor: isDarkMode ? "white" : "black",
          background: {
            type: "solid" as ColorType | undefined,
            color: isDarkMode ? "#1E1E1E" : "white",
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            labelVisible: false,
          },
        },
        rightPriceScale: {
          visible: true,
        },
        timeScale: {
          visible: true,
        },
      });

      chartRef.current = chart;

      const allKeys = filteredData.reduce<string[]>((keys, fund) => {
        return keys.concat(Object.keys(fund).filter((key) => key !== "date"));
      }, []);
      const uniqueFunds = Array.from(new Set(allKeys));

      uniqueFunds.forEach((fund, index) => {
        const series = chart.addLineSeries({
          color: colorScales(index),
          lineWidth: 1,
          title: fund,
        });

        const fundDataFromStartDate = filteredData.filter(
          (item) => item[fund] !== undefined
        );

        if (fundDataFromStartDate.length === 0) {
          return;
        }

        const initialValue = fundDataFromStartDate[0][fund];

        const fundData = fundDataFromStartDate.map((item) => {
          const currentValue = item[fund];
          const percentageChange =
            ((currentValue - initialValue) / initialValue) * 100;

          return {
            time: item.date as Time,
            value: isNavSelected ? currentValue : percentageChange,
          };
        });

        series.setData(fundData);
      });

      const toolTip = document.createElement("div");
      toolTip.className = "tooltip-chart";
      chartContainerRef.current.appendChild(toolTip);

      chart.subscribeCrosshairMove((param: any) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chartWidth ||
          param.point.y < 0 ||
          param.point.y > chartHeight
        ) {
          toolTip.style.display = "none";
        } else {
          const date = new Date(param.time * 1000);
          const dateStr = format(date, "MMM dd, yyyy");
          let tooltipContent = `<div>${dateStr}</div>
<div style="display:flex; flex-direction:column; align-items: flex-start;">
  <div style="display:flex; justify-content:space-between; width: 100%;">
    <div style="text-align:left; width: 130%;">Fund</div>
    <div style="text-align:left; width: 100%;">Return</div>
    ${isNavSelected ? "" : "<div style='text-align:left; width: 100%;'>CARG</div>"}
  </div>
</div>`;
          param.seriesData?.forEach((value: any, seriesApi: any) => {
            const color = seriesApi.options().color as string;
            const tooltipValue = isNavSelected
              ? `${value.value.toFixed(2)} VND`
              : `${value.value.toFixed(2)} %`;
            const cargValue = 1 + value.value / 100 ?? 0;
            tooltipContent += `<div style="color:${color}; display:flex; 
            justify-content:space-between; align-items: flex-start;">
              <div style="text-align:left; width: 130%;">${seriesApi.options().title}:</div>
              <div style="text-align:left; display:flex; justify-content:start; width: 100%;">${tooltipValue}</div>
              ${isNavSelected ? "" : `<div style="text-align:left; width: 100%;">${cargValue.toFixed(2)}%</div>`}
            </div>`;
          });

          toolTip.style.display = "block";
          toolTip.innerHTML = tooltipContent;
          toolTip.style.backgroundColor = isDarkMode ? "white" : "black";
          toolTip.style.color = isDarkMode ? "black" : "white";
          if (param.point.x >= chartWidth - 200) {
            toolTip.style.transform = "translate(-100%, -50%)";
            toolTip.style.left = `${param.point.x}px`;
            toolTip.style.top = `${param.point.y}px`;
          } else {
            toolTip.style.transform = "translate(10%, -50%)";
            toolTip.style.left = `${param.point.x}px`;
            toolTip.style.top = `${param.point.y}px`;
          }
        }
      });

      chart.timeScale().fitContent();
    }, [
      filteredData,
      isDarkMode,
      colorScales,
      chartHeight,
      chartWidth,
      screenWidth,
      isNavSelected,
    ]);

    // Use Effect
    useEffect(() => {
      if (data.length > 0) {
        handleDrawChart();
      }
    }, [
      data,
      handleDrawChart,
      isDarkMode,
      selectedPeriod,
      dateRange,
      chartHeight,
      chartWidth,
      screenWidth,
    ]);

    useEffect(() => {
      if (chartData && chartData.length > 0) {
        setData(chartData);
      }
    }, [chartData]);

    return (
      <div className="flex w-full flex-col justify-center items-center">
        <ChartController
          handlePeriodSelect={handlePeriodSelect}
          selectedPeriod={selectedPeriod}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setSelectedPeriod={setSelectedPeriod}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsNavSelected={setIsNavSelected}
          isNavSelected={isNavSelected}
        />
        <div
          className="flex "
          style={{
            position: "relative",
            width: `${chartWidth}px`,
            height: `${chartHeight}px`,
          }}
        >
          <div
            ref={chartContainerRef}
            className="border border-gray-600"
            style={{
              width: "100%",
              height: "100%",
            }}
          ></div>
          <Expand
            style={{
              color: isDarkMode ? "white" : "black",
            }}
            ref={resizeRef as any}
            width={20}
            height={20}
            className="screen-resize"
          />
        </div>
        <FundController
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fundsByType={fundsByType}
          selectedFunds={selectedFunds}
          setSelectedFunds={setSelectedFunds}
        />
        <div className="flex justify-center pt-10">
          <Button
            className="w-[200px] h-[40px] text-sm font-medium text-white bg-primary hover:bg-primary/90"
            onClick={() => handleExportCSV(selectedFunds, filteredData)}
          >
            Export CSV
          </Button>
        </div>
      </div>
    );
  }
);

DrawChart.displayName = "DrawChart";

export default DrawChart;
