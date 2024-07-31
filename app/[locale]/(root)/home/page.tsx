// Home.tsx
"use client";
import ChartView from "@/components/ChartView";
import store from "@/store/store";
import { Provider } from "react-redux";

const Home = () => {
  return <ChartView />;
};

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;
