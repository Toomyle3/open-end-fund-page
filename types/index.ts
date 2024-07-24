export type FundInfoTable = {
  fund_id: number;
  name: string;
  short_name: string;
  code: string;
  fund_url: string;
  fund_type: string;
  fund_status: string;
  avatar_url: string;
};

export type FundData = {
  date: number;
  [key: string]: number;
};

export type DrawChartProps = {
  chartData: FundData[];
  initialHeight?: number;
  screenWidth: number;
};
