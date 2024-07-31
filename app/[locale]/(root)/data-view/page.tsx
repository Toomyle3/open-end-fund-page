"use client";
import DataTable from "@/components/DataTable";
import { getAllFund } from "@/services/fundService";
import { setAllFundData } from "@/store/fundsSlice";
import store from "@/store/store";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

const View = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFund(100);
      if (data) {
        dispatch(setAllFundData(data));
      }
    };

    fetchData();
  }, []);
  return <DataTable />;
};

const App = () => (
  <Provider store={store}>
    <View />
  </Provider>
);

export default App;
