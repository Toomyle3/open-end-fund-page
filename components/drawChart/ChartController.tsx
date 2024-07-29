"use client";
import { PERIODS } from "@/constants";
import { format } from "date-fns";
import { CalendarFold } from "lucide-react";
import "../index.css";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ChartController {
  handlePeriodSelect: (period: (typeof PERIODS)[number]) => void;
  selectedPeriod: (typeof PERIODS)[number];
  setSelectedPeriod: (period: (typeof PERIODS)[number]) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  isNavSelected: boolean;
  setIsNavSelected: (isNav: boolean) => void;
}

const ChartController = ({
  handlePeriodSelect,
  selectedPeriod,
  dateRange,
  setDateRange,
  setSelectedPeriod,
  isDarkMode,
  setIsDarkMode,
  setIsNavSelected,
  isNavSelected,
}: ChartController) => {
  return (
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
  );
};

export default ChartController;
