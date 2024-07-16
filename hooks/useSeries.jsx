import { useEffect } from "react";

const useSeries = (chartRef, filteredData, colorScales, isNavSelected) => {
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = chartRef.current;

    const allKeys = filteredData.reduce((keys, fund) => {
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
          time: item.date,
          value: isNavSelected ? currentValue : percentageChange,
        };
      });

      series.setData(fundData);
    });

    chart.timeScale().fitContent();
  }, [chartRef, filteredData, colorScales, isNavSelected]);
};

export default useSeries;
