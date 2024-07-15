export const funds_info = [
  { name: "VNINDEX", type: "Index" },
  { name: "VN30", type: "Index" },
  { name: "DCDS", type: "Equity Fund", company: "Dragon Capital" },
  { name: "DCDE", type: "Equity Fund", company: "Dragon Capital" },
  { name: "DCBF", type: "Bond", company: "Dragon Capital" },
  { name: "DCIP", type: "Bond", company: "Dragon Capital" },
  { name: "E1VFVN30", type: "ETF", company: "Dragon Capital" },
  { name: "FUEVFVND", type: "ETF", company: "Dragon Capital" },
  { name: "FUEDCMID", type: "ETF", company: "Dragon Capital" },
  { name: "TCEF", type: "Equity Fund", company: "Techcom Capital" },
  { name: "TCBF", type: "Bond", company: "Techcom Capital" },
  { name: "TCFF", type: "Bond", company: "Techcom Capital" },
  { name: "TCFIN", type: "Equity Fund", company: "Techcom Capital" },
  { name: "VCBFMGF", type: "Equity Fund", company: "VCBF" },
  { name: "VCBFTBF", type: "Equity Fund", company: "VCBF" },
  { name: "VCBFBCF", type: "Equity Fund", company: "VCBF" },
  { name: "VCBFFIF", type: "Bond", company: "VCBF" },
  { name: "VESAF", type: "Equity Fund", company: "VinaCapital" },
  { name: "VEOF", type: "Equity Fund", company: "VinaCapital" },
  { name: "VIBF", type: "Equity Fund", company: "VinaCapital" },
  { name: "VFF", type: "Bond", company: "VinaCapital" },
  { name: "VLBF", type: "Bond", company: "VinaCapital" },
  { name: "FUEVN100", type: "ETF", company: "VinaCapital" },
  { name: "SSISCA", type: "Equity Fund", company: "SSIAM" },
  { name: "SSIBF", type: "Bond", company: "SSIAM" },
  { name: "VLGF", type: "Equity Fund", company: "SSIAM" },
  { name: "FUESSV50", type: "ETF", company: "SSIAM" },
  { name: "FUESSVFL", type: "ETF", company: "SSIAM" },
  { name: "FUESSV30", type: "ETF", company: "SSIAM" },
  { name: "BVFED", type: "Equity Fund", company: "Baoviet Fund" },
  { name: "BVBF", type: "Bond", company: "Baoviet Fund" },
  { name: "BVPF", type: "Equity Fund", company: "Baoviet Fund" },
  { name: "ENF", type: "Equity Fund", company: "Eastspring" },
  { name: "VNDAF", type: "Equity Fund", company: "IPAAM" },
  { name: "VNDBF", type: "Bond", company: "IPAAM" },
  { name: "FUEIP100", type: "ETF", company: "IPAAM" },
  { name: "MAFEQI", type: "Equity Fund", company: "Manulife IM" },
  { name: "MAFBAL", type: "Equity Fund", company: "Manulife IM" },
  { name: "MBVF", type: "Equity Fund", company: "MB Capital" },
  { name: "MBBOND", type: "Bond", company: "MB Capital" },
  { name: "FUEMAV30", type: "ETF", company: "Mirae Asset" },
  { name: "FUEKIV30", type: "ETF", company: "KIM" },
  { name: "FUEKIVFS", type: "ETF", company: "KIM" },
];

export const fund_types = ["Index", "ETF", "Equity Fund", "Bond"];

export const defaultFunds = ["VNINDEX", "DCDS"];

export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/data_view.svg",
    route: "/data-view",
    label: "Date View",
  },
];

export const PERIODS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 1095 },
  { label: "5Y", days: 1825 },
  { label: "All", days: Infinity },
];
