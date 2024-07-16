"use client";
import { defaultFunds, funds_info, PERIODS } from "@/constants";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import * as d3 from "d3";
import { format } from "date-fns";
import FileSaver from "file-saver";
import JSZip from "jszip";
import { ColorType, createChart, IChartApi, Time } from "lightweight-charts";
import { CalendarFold, Expand } from "lucide-react";
import moment from "moment";
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
import { Checkbox } from "./ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DrawChartProps, FundData } from "@/types";

const DrawChart: React.FC<DrawChartProps> = memo(
  ({ chartData, screenWidth, initialHeight = 600 }) => {
    // States
    const [data, setData] = useState<FundData[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[6]);
    const [selectedFunds, setSelectedFunds] = useState<string[]>(defaultFunds);
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNavSelected, setIsNavSelected] = useState(false);
    const [chartHeight, setChartHeight] = useState(initialHeight);
    const [chartWidth, setChartWidth] = useState(
      screenWidth < 1000 ? screenWidth - 40 : 800
    );
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
    const resizeRef = useRef<HTMLDivElement>(null);
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
            const cargValue = 1 + value.value / 100;
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

    const fundsByType: any = {};
    funds_info.forEach((fund: any) => {
      if (!fundsByType[fund.type]) {
        fundsByType[fund.type] = [];
      }
      fundsByType[fund.type].push(fund);
    });

    const handleExportCSV = () => {
      if (
        !selectedFunds ||
        selectedFunds.length === 0 ||
        !filteredData ||
        filteredData.length === 0
      ) {
        return;
      }
      const zip = new JSZip();
      selectedFunds.forEach((fund) => {
        const header = ["date", fund];
        const rows = filteredData
          .filter((row) => row[fund] !== undefined && row[fund] !== null)
          .map((row) => [
            moment(row.date * 1000).format("YYYY-MM-DD"),
            row[fund],
          ]);
        const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
        zip.file(`${fund}.csv`, csvContent);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, "funds_data.zip");
      });
    };

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
      let startX = 0,
        startY = 0;

      const handleResizeStart = (clientX: number, clientY: number) => {
        isResizing = true;
        startX = clientX;
        startY = clientY;
      };

      const handleResizeMove = (clientX: number, clientY: number) => {
        if (!isResizing) return;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        setChartWidth((prev) => prev + deltaX);
        setChartHeight((prev) => prev + deltaY);

        startX = clientX;
        startY = clientY;
      };

      const handleResizeEnd = () => {
        isResizing = false;
      };

      const onTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        handleResizeStart(touch.clientX, touch.clientY);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", onTouchEnd);
      };

      const onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        handleResizeMove(touch.clientX, touch.clientY);
      };

      const onTouchEnd = () => {
        handleResizeEnd();
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      };

      const onMouseDown = (e: MouseEvent) => {
        handleResizeStart(e.clientX, e.clientY);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (e: MouseEvent) => {
        handleResizeMove(e.clientX, e.clientY);
      };

      const onMouseUp = () => {
        handleResizeEnd();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      if (screenWidth < 500) {
        resizeHandle.addEventListener(
          "touchstart",
          onTouchStart as EventListener
        );
      } else {
        resizeHandle.addEventListener("mousedown", onMouseDown);
      }

      return () => {
        resizeHandle.removeEventListener(
          "touchstart",
          onTouchStart as EventListener
        );
        resizeHandle.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
      };
    }, [resizeRef, screenWidth]);

    return (
      <div className="flex w-full flex-col justify-center items-center">
        <div
          className="flex w-full max-w-[800px] justify-start 
        items-center pb-4 gap-4 
        flex-col sm:flex-row"
        >
          <div className="flex gap-2">
            {PERIODS.map((period) => (
              <Button
                key={period.label}
                onClick={() => handlePeriodSelect(period)}
                className={`text-[12px] text-gray-700 onHover flex 
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
                <Button variant="outline" className="onHover">
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
              className="h-[40px] w-[100px] onHover text-sm"
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
              className="onHover h-[40px] min-w-[100px] text-[#111827] 
              text-sm bg-[#ffffff] 
              border border-[#111827]"
              onClick={(value) => setIsNavSelected(!isNavSelected)}
            >
              {isNavSelected ? "Net asset value" : "% value"}
            </Button>
          </div>
        </div>
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
        <div className="pt-10 w-full flex max-w-[800px]">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={cn("w-full bg-gray-600 text-white rounded", {
              "h-[50px]": !isOpen,
            })}
          >
            <CollapsibleTrigger asChild className="flex cursor-pointer">
              <div className="flex items-center justify-between px-4 h-[50px]">
                <h4 className="font-[500] font-serif pl-[20px]">
                  Show All Funds
                </h4>
                <CaretSortIcon className="h-6 w-6" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              style={{
                padding: "0px 40px 40px 40px",
              }}
              className="collapsible-items w-full flex justify-center items-center gap-4"
            >
              <div
                className="w-full
                sm:flex sm:justify-around
                 grid grid-cols-2 
                gap-6 sm:grid-cols-4 
                max-h-[500px] overflow-auto
                pt-4"
              >
                {Object.keys(fundsByType).map((type) => (
                  <div key={type} className="flex flex-col gap-2">
                    <h2 className="flex font-serif justify-start text-lg font-[500] mb-4">
                      {type}
                    </h2>
                    {fundsByType[type].map((fund: any) => (
                      <div
                        key={fund.name}
                        className="font-serif flex items-center gap-4"
                      >
                        <Checkbox
                          id={fund.name}
                          className="bg-white"
                          checked={selectedFunds.includes(fund.name)}
                          onCheckedChange={(value) => {
                            if (value) {
                              setSelectedFunds((prev) => {
                                return [...prev, fund.name];
                              });
                            } else {
                              setSelectedFunds((prev) => {
                                return prev.filter(
                                  (value) => value !== fund.name
                                );
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={fund.name}
                          className="text-sm font-medium leading-none"
                        >
                          {fund.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="flex justify-center pt-10">
          <Button
            className="w-[200px] h-[40px] text-sm font-medium text-white bg-primary hover:bg-primary/90"
            onClick={handleExportCSV}
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
