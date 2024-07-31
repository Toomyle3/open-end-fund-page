import { AllFund, FundRequestBody } from "../types";
import axiosInstance from "@/axios/axios";
import { setAllFundData } from "@/store/fundsSlice";
import { useDispatch } from "react-redux";

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

export { getAllFund };
