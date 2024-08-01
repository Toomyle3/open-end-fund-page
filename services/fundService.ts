import axiosInstance from "@/axios/axios";
import { AllFund, FundeNavData, FundNavRequestBody, FundRequestBody } from "../types";

const getAllFund = async (pageSize: number): Promise<AllFund[] | null> => {
  const requestBody: FundRequestBody = {
    types: ["NEW_FUND", "TRADING_FUND"],
    issuerIds: [],
    sortOrder: "DESC",
    sortField: "annualizedReturn36Months",
    page: 1,
    pageSize: pageSize,
    isIpo: false,
    fundAssetTypes: [],
    bondRemainPeriods: [],
    searchField: "",
    isBuyByReward: false,
  };

  try {
    const response = await axiosInstance.post<AllFund[]>(
      "/fmarket/res/products/filter",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all funds:", error);
    return null;
  }
};

const getFundNav = async (fundId: number): Promise<FundeNavData[] | null> => {
  const requestBody: FundNavRequestBody = {
    isAllData: 0,
    productId: fundId,
    fromDate: '198000101',
    toDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  };

  try {
    const response = await axiosInstance.post<FundeNavData[]>(
      "/fmarket/res/product/get-nav-history",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching fund's nav:", error);
    return null;
  }
};

export { getAllFund, getFundNav };
