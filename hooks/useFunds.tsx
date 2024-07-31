
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useAllFundData = () => {
  return useSelector((state: RootState) => state.allFund.allFund);
};
