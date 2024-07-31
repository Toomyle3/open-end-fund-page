import { configureStore } from '@reduxjs/toolkit';
import fundsSlice from './fundsSlice';

const store = configureStore({
  reducer: {
    allFund: fundsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
