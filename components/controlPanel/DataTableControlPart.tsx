import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type FundInfo = {
  id: string;
  name: string;
  shortName: string;
  code: string;
  websiteURL: string;
  dataFundAssetType: { code: string };
  status: string;
  owner: { avatarUrl: string };
};

const DataTableControlPart = () => {
  const [options, setOptions] = useState<FundInfo[]>();
  const handlePostFundInfo = useMutation(api.fundInfo.createFundsInfo);

  const fetchFundInfo = async () => {
    const payload: any = options?.map((option) => ({
      fund_id: option.id,
      name: option.name,
      short_name: option.shortName,
      code: option.code,
      fund_url: option.websiteURL,
      fund_type: option.dataFundAssetType.code,
      fund_status: option.status,
      avatar_url: option.owner.avatarUrl,
    }));

    await handlePostFundInfo({ fundsData: payload });
  };

  useEffect(() => {
    fetch("https://api.fmarket.vn/res/products/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        types: ["NEW_FUND", "TRADING_FUND"],
        issuerIds: [],
        sortOrder: "DESC",
        sortField: "navTo12Months",
        page: 1,
        pageSize: 100,
        fundAssetTypes: [],
        bondRemainPeriods: [],
        searchField: "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOptions(data?.data?.rows);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div>
      <div className="flex justify-center pt-10">
        <Button
          className="w-[180px] h-[40px] flex gap-2"
          onClick={fetchFundInfo}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default DataTableControlPart;
