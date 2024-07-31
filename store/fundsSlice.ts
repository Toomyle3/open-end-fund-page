import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllFund } from '../types';

interface FundStates {
  allFund: AllFund[];
}

const initialState: FundStates = {
  allFund: [],
};

const fundsSlice = createSlice({
  name: 'allFund',
  initialState,
  reducers: {
    setAllFundData(state, action: PayloadAction<AllFund[]>) {
      state.allFund = action.payload;
    },
  },
});

export const { setAllFundData } = fundsSlice.actions;
export default fundsSlice.reducer;
