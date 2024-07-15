"use client";
import { PERIODS } from "@/constants";
import * as d3 from "d3";
import { format } from "date-fns";
import { ColorType, createChart, IChartApi, Time } from "lightweight-charts";
import { CalendarFold, Cog } from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FundData {
  date: number;
  [key: string]: number;
}

interface DrawChartProps {
  chartData: FundData[];
  initialHeight?: number;
  initialWidth?: number;
  screenWidth: number;
}

const DrawChart: React.FC<DrawChartProps> = memo(
  ({ chartData, screenWidth, initialHeight = 600, initialWidth = 800 }) => {
    // States
    const [data, setData] = useState<FundData[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[6]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNavSelected, setIsNavSelected] = useState(false);
    const [chartHeight, setChartHeight] = useState(initialHeight);
    const [chartWidth, setChartWidth] = useState(initialWidth);
    const [dateRange, setDateRange] = useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({
      from: undefined,
      to: undefined,
    });

    // Refs
    const chartRef = useRef<IChartApi | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);

    const colorScales = useMemo(
      () => d3.scaleSequential(d3.interpolateRainbow).domain([0, 50]),
      []
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

      return data.filter(
        (item) => item.date >= startDate && item.date <= endDate
      );
    }, [data, dateRange, selectedPeriod]);

    const handlePeriodSelect = (period: (typeof PERIODS)[number]) => {
      setSelectedPeriod(period);
      setDateRange({ from: undefined, to: undefined });
    };

    const handleDrawChart = useCallback(() => {
      if (!chartContainerRef.current) return;

      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = createChart(chartContainerRef.current, {
        width: chartWidth,
        height: chartHeight,
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
          let tooltipContent = `<div>${dateStr}</div><div>Fund - Return</div>`;
          param.seriesData?.forEach((value: any, seriesApi: any) => {
            const color = seriesApi.options().color as string;
            const tooltipValue = isNavSelected
              ? `${value.value.toFixed(2)} VND`
              : `${value.value.toFixed(2)} %`;
            tooltipContent += `<div style="color:${color}">${seriesApi.options().title}: ${tooltipValue}</div>`;
          });

          toolTip.style.display = "block";
          toolTip.innerHTML = tooltipContent;
          toolTip.style.left = `${param.point.x}px`;
          toolTip.style.top = `${param.point.y}px`;
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

    useEffect(() => {
      const resizeHandle = resizeRef.current;
      if (!resizeHandle) return;

      let isResizing = false;
      let startX: number, startY: number;

      const onMouseDown = (e: MouseEvent) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        setChartWidth((prev) => prev + deltaX);
        setChartHeight((prev) => prev + deltaY);

        startX = e.clientX;
        startY = e.clientY;
      };

      const onMouseUp = () => {
        isResizing = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      resizeHandle.addEventListener("mousedown", onMouseDown);

      return () => {
        resizeHandle.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }, []);

    return (
      <div className="flex w-full flex-col justify-center">
        <div
          className="flex justify-start 
        items-center pb-4 gap-4 
        flex-col sm:flex-row"
        >
          <div className="flex gap-2">
            {PERIODS.map((period) => (
              <Button
                key={period.label}
                onClick={() => handlePeriodSelect(period)}
                className={`text-[12px] text-gray-700 flex 
      justify-center items-center 
      h-[40px] w-[40px] rounded ${
        selectedPeriod === period && !dateRange?.from
          ? "bg-blue-500 text-white"
          : "bg-gray-200"
      }`}
              >
                {period.label}
              </Button>
            ))}
          </div>
          <div className="h-[40px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {dateRange?.from ? (
                    dateRange?.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <CalendarFold />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{ from: dateRange?.from, to: dateRange?.to }}
                  onSelect={(selected) => {
                    setDateRange(selected as any);
                    if (selected?.from && selected?.to) {
                      setSelectedPeriod(PERIODS[6]);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex">
            <Button
              id="chart-mode"
              className="h-[40px] w-[100px] text-sm"
              style={{
                background: isDarkMode ? "#111827" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#111827",
                border: isDarkMode ? "1px solid #ffffff" : "1px solid #111827",
              }}
              onClick={(value) => {
                setIsDarkMode(!isDarkMode);
              }}
            >
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Button>
          </div>
          <div className="flex">
            <Button
              id="chart-mode"
              className="h-[40px] min-w-[100px] text-[#111827] 
              text-sm bg-[#ffffff] 
              border border-[#111827]"
              onClick={(value) => setIsNavSelected(!isNavSelected)}
            >
              {isNavSelected ? "Net asset value" : "% value"}
            </Button>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: `${chartWidth}px`,
            height: `${chartHeight}px`,
          }}
        >
          <div
            ref={chartContainerRef}
            style={{ width: "100%", height: "100%" }}
            className="border border-gray-600"
          ></div>
          <Cog
            ref={resizeRef as any}
            width={20}
            height={20}
            className="screen-resize"
          />
        </div>
      </div>
    );
  }
);

DrawChart.displayName = "DrawChart";

export default DrawChart;
