// Home.tsx
"use client";
import ChartView from "@/components/ChartView";
import { getAllFund } from "@/services/fundService";
import store from "@/store/store";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { setAllFundData } from "@/store/fundsSlice";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFund(100);
      if (data) {
        dispatch(setAllFundData(data));
      }
    };

    fetchData();
  }, [dispatch]);

  return <ChartView />;
};

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;
