export type FundInfoTable = {
  fund_id: number;
  name: string;
  short_name: string;
  code: string;
  fund_url: string;
  fund_type: string;
  fund_status: string;
  avatar_url: string;
};

export type FundData = {
  date: number;
  [key: string]: number;
};

export type DrawChartProps = {
  chartData: FundData[];
  initialHeight?: number;
  screenWidth: number;
};

// get all funds type
// services/apiService.ts
export interface DataFundAssetType {
  code: string;
  id: number;
  name: string;
}

export interface Extra {
  current_nav: number;
  last_nav: number;
  last_nav_date: number;
}

export interface FundType {
  id: number;
  name: string;
}

export interface Owner {
  address1: string;
  avatarUrl: string;
  buySellLimitDaily: null | any;
  code: string;
  email: string;
  email2: string;
  encodeURL: string;
  hsbcCode: string;
  id: number;
  isEnableEsign: boolean;
  isSignBeforeBuy: boolean;
  name: string;
  phone: string;
  phonePostal: string;
  securityDepositoryCenter: {
    code: string;
    id: number;
    name: string;
  };
  shortName: string;
  templateContract: string;
  userCode: string;
  userId: number;
  website: string;
  withdrawLimitDaily: null | any;
  withdrawLimitSession: null | any;
}

export interface ProductNavChange {
  annualizedReturn36Months: number;
  navTo12Months: number;
  navTo1Months: number;
  navTo24Months: number;
  navTo36Months: number;
  navTo3Months: number;
  navTo60Months: number;
  navTo6Months: number;
  navToBeginning: number;
  navToEstablish: number;
  navToLastYear: number;
  navToPrevious: number;
  updateAt: number;
}

export interface ProductFund {
  id: number;
  ipoEndTime: null | any;
  ipoStartTime: null | any;
  ipoStatusCode: null | any;
  isBuyByReward: boolean;
  issueAt: null | any;
  surveyIpoTemplate: null | any;
  updateAssetHoldingTime: string;
}

export interface AllFund {
  approveAt: number;
  avgAnnualReturn: number;
  balance: number;
  buyMax: null | any;
  buyMaxValue: null | any;
  buyMin: null | any;
  buyMinValue: null | any;
  closedBankNote: null | any;
  closedOrderBookAt: null | any;
  closedOrderBookShiftDay: null | any;
  code: string;
  completeTransactionDuration: number;
  contentHome: null | any;
  createAt: number;
  customField: string;
  customValue: string;
  dataFundAssetType: DataFundAssetType;
  description: string;
  endIssueAt: number;
  expectedReturn: number;
  extra: Extra;
  feeBalance: number;
  firstIssueAt: number;
  fundType: FundType;
  holdingMin: number;
  holdingVolume: number;
  id: number;
  instock: null | any;
  isDelete: boolean;
  isOnlySellMinNotSellAll: boolean;
  isProductIpo: boolean;
  isTransferred: boolean;
  issueValue: null | any;
  issueVolume: null | any;
  lastYearNav: number;
  managementFee: number;
  maturityAt: null | any;
  moneyTransferSyntax: null | any;
  name: string;
  nav: number;
  owner: Owner;
  performanceFee: null | any;
  price: number;
  productAssetAllocationList: null | any;
  productAssetAllocationModel1: null | any;
  productAssetAllocationModel2: null | any;
  productAssetAllocationModelList: null | any;
  productAssetHoldingList: null | any;
  productBond: null | any;
  productCD: null | any;
  productDocuments: null | any;
  productFeeDiscountList: null | any;
  productFeeList: null | any;
  productFeeSipList: null | any;
  productFund: ProductFund;
  productGold: null | any;
  productIndustriesHoldingList: null | any;
  productNavChange: ProductNavChange;
  productSupervisoryBankAccount: null | any;
  productSupervisoryBankAccountList: null | any;
  productTopHoldingBondList: null | any;
  productTopHoldingList: null | any;
  productTradingSession: null | any;
  productTransactionDateList: null | any;
  productTransactionDateModelList: null | any;
  riskLevel: null | any;
  sellMin: number;
  sellMinValue: null | any;
  shortName: string;
  sipCode: string;
  status: string;
  tradeCode: string;
  transferSellMin: number;
  type: string;
  updateAt: number;
  vsdFeeId: string;
  website: string;
  websiteURL: string;
}

export interface FundRequestBody {
  types: string[];
  issuerIds: string[];
  sortOrder: string;
  sortField: string;
  page: number;
  pageSize: number;
  isIpo: boolean;
  fundAssetTypes: string[];
  bondRemainPeriods: string[];
  searchField: string;
  isBuyByReward: boolean;
}

export interface FundNavRequestBody {
  isAllData: number;
  productId: number;
  fromDate: string;
  toDate: string;
}

export interface FundeNavData {
  createdAt: number;
  id: number;
  nav: number;
  navDate: string;
  productId: number;
}
