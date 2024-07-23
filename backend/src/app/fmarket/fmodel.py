import json
from typing import List, Optional

class Fund:
    def __init__(self, data):
        self.id = data.get('id')
        self.name = data.get('name')
        self.shortName = data.get('shortName')
        self.code = data.get('code')
        self.tradeCode = data.get('tradeCode')
        self.sipCode = data.get('sipCode')
        self.price = data.get('price')
        self.nav = data.get('nav')
        self.lastYearNav = data.get('lastYearNav')
        self.buyMin = data.get('buyMin')
        self.buyMax = data.get('buyMax')
        self.buyMinValue = data.get('buyMinValue')
        self.buyMaxValue = data.get('buyMaxValue')
        self.sellMin = data.get('sellMin')
        self.sellMinValue = data.get('sellMinValue')
        self.transferSellMin = data.get('transferSellMin')
        self.isOnlySellMinNotSellAll = data.get('isOnlySellMinNotSellAll')
        self.holdingMin = data.get('holdingMin')
        self.instock = data.get('instock')
        self.holdingVolume = data.get('holdingVolume')
        self.issueVolume = data.get('issueVolume')
        self.issueValue = data.get('issueValue')
        self.firstIssueAt = data.get('firstIssueAt')
        self.approveAt = data.get('approveAt')
        self.endIssueAt = data.get('endIssueAt')
        self.maturityAt = data.get('maturityAt')
        self.website = data.get('website')
        self.websiteURL = data.get('websiteURL')
        self.customField = data.get('customField')
        self.customValue = data.get('customValue')
        self.expectedReturn = data.get('expectedReturn')
        self.managementFee = data.get('managementFee')
        self.performanceFee = data.get('performanceFee')
        self.closedOrderBookAt = data.get('closedOrderBookAt')
        self.closedOrderBookShiftDay = data.get('closedOrderBookShiftDay')
        self.closedBankNote = data.get('closedBankNote')
        self.productTradingSession = data.get('productTradingSession')
        self.completeTransactionDuration = data.get('completeTransactionDuration')
        self.description = data.get('description')
        self.balance = data.get('balance')
        self.feeBalance = data.get('feeBalance')
        self.vsdFeeId = data.get('vsdFeeId')
        self.avgAnnualReturn = data.get('avgAnnualReturn')
        self.isTransferred = data.get('isTransferred')
        self.createAt = data.get('createAt')
        self.updateAt = data.get('updateAt')
        self.productAssetAllocationList = data.get('productAssetAllocationList')
        self.productAssetAllocationModelList = data.get('productAssetAllocationModelList')
        self.productAssetAllocationModel1 = data.get('productAssetAllocationModel1')
        self.productAssetAllocationModel2 = data.get('productAssetAllocationModel2')
        self.owner = Owner(data.get('owner')) if data.get('owner') else None
        self.type = data.get('type')
        self.status = data.get('status')
        self.riskLevel = data.get('riskLevel')
        self.moneyTransferSyntax = data.get('moneyTransferSyntax')
        self.fundType = FundType(data.get('fundType')) if data.get('fundType') else None
        self.dataFundAssetType = DataFundAssetType(data.get('dataFundAssetType')) if data.get('dataFundAssetType') else None
        self.productBond = data.get('productBond')
        self.productCD = data.get('productCD')
        self.productGold = data.get('productGold')
        self.productFund = ProductFund(data.get('productFund')) if data.get('productFund') else None
        self.productNavChange = ProductNavChange(data.get('productNavChange')) if data.get('productNavChange') else None
        self.productFeeList = data.get('productFeeList')
        self.productFeeSipList = data.get('productFeeSipList')
        self.productFeeDiscountList = data.get('productFeeDiscountList')
        self.productTransactionDateList = data.get('productTransactionDateList')
        self.productTransactionDateModelList = data.get('productTransactionDateModelList')
        self.productSupervisoryBankAccount = data.get('productSupervisoryBankAccount')
        self.productSupervisoryBankAccountList = data.get('productSupervisoryBankAccountList')
        self.productTopHoldingList = data.get('productTopHoldingList')
        self.productTopHoldingBondList = data.get('productTopHoldingBondList')
        self.productAssetHoldingList = data.get('productAssetHoldingList')
        self.productIndustriesHoldingList = data.get('productIndustriesHoldingList')
        self.productDocuments = data.get('productDocuments')
        self.extra = Extra(data.get('extra')) if data.get('extra') else None
        self.isDelete = data.get('isDelete')
        self.isProductIpo = data.get('isProductIpo')
        self.contentHome = data.get('contentHome')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'shortName': self.shortName,
            'code': self.code,
            'tradeCode': self.tradeCode,
            'sipCode': self.sipCode,
            'price': self.price,
            'nav': self.nav,
            'lastYearNav': self.lastYearNav,
            'buyMin': self.buyMin,
            'buyMax': self.buyMax,
            'buyMinValue': self.buyMinValue,
            'buyMaxValue': self.buyMaxValue,
            'sellMin': self.sellMin,
            'sellMinValue': self.sellMinValue,
            'transferSellMin': self.transferSellMin,
            'isOnlySellMinNotSellAll': self.isOnlySellMinNotSellAll,
            'holdingMin': self.holdingMin,
            'instock': self.instock,
            'holdingVolume': self.holdingVolume,
            'issueVolume': self.issueVolume,
            'issueValue': self.issueValue,
            'firstIssueAt': self.firstIssueAt,
            'approveAt': self.approveAt,
            'endIssueAt': self.endIssueAt,
            'maturityAt': self.maturityAt,
            'website': self.website,
            'websiteURL': self.websiteURL,
            'customField': self.customField,
            'customValue': self.customValue,
            'expectedReturn': self.expectedReturn,
            'managementFee': self.managementFee,
            'performanceFee': self.performanceFee,
            'closedOrderBookAt': self.closedOrderBookAt,
            'closedOrderBookShiftDay': self.closedOrderBookShiftDay,
            'closedBankNote': self.closedBankNote,
            'productTradingSession': self.productTradingSession,
            'completeTransactionDuration': self.completeTransactionDuration,
            'description': self.description,
            'balance': self.balance,
            'feeBalance': self.feeBalance,
            'vsdFeeId': self.vsdFeeId,
            'avgAnnualReturn': self.avgAnnualReturn,
            'isTransferred': self.isTransferred,
            'createAt': self.createAt,
            'updateAt': self.updateAt,
            'productAssetAllocationList': self.productAssetAllocationList,
            'productAssetAllocationModelList': self.productAssetAllocationModelList,
            'productAssetAllocationModel1': self.productAssetAllocationModel1,
            'productAssetAllocationModel2': self.productAssetAllocationModel2,
            'owner': self.owner.to_dict() if self.owner else None,
            'type': self.type,
            'status': self.status,
            'riskLevel': self.riskLevel,
            'moneyTransferSyntax': self.moneyTransferSyntax,
            'fundType': self.fundType.to_dict() if self.fundType else None,
            'dataFundAssetType': self.dataFundAssetType.to_dict() if self.dataFundAssetType else None,
            'productBond': self.productBond,
            'productCD': self.productCD,
            'productGold': self.productGold,
            'productFund': self.productFund.to_dict() if self.productFund else None,
            'productNavChange': self.productNavChange.to_dict() if self.productNavChange else None,
            'productFeeList': self.productFeeList,
            'productFeeSipList': self.productFeeSipList,
            'productFeeDiscountList': self.productFeeDiscountList,
            'productTransactionDateList': self.productTransactionDateList,
            'productTransactionDateModelList': self.productTransactionDateModelList,
            'productSupervisoryBankAccount': self.productSupervisoryBankAccount,
            'productSupervisoryBankAccountList': self.productSupervisoryBankAccountList,
            'productTopHoldingList': self.productTopHoldingList,
            'productTopHoldingBondList': self.productTopHoldingBondList,
            'productAssetHoldingList': self.productAssetHoldingList,
            'productIndustriesHoldingList': self.productIndustriesHoldingList,
            'productDocuments': self.productDocuments,
            'extra': self.extra.to_dict() if self.extra else None,
            'isDelete': self.isDelete,
            'isProductIpo': self.isProductIpo,
            'contentHome': self.contentHome
        }
    
    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)

class Owner:
    def __init__(self, data):
        self.id = data.get('id')
        self.encodeURL = data.get('encodeURL')
        self.code = data.get('code')
        self.name = data.get('name')
        self.userId = data.get('userId')
        self.userCode = data.get('userCode')
        self.email = data.get('email')
        self.email2 = data.get('email2')
        self.shortName = data.get('shortName')
        self.address1 = data.get('address1')
        self.phone = data.get('phone')
        self.phonePostal = data.get('phonePostal')
        self.website = data.get('website')
        self.templateContract = data.get('templateContract')
        self.hsbcCode = data.get('hsbcCode')
        self.securityDepositoryCenter = SecurityDepositoryCenter(data.get('securityDepositoryCenter')) if data.get('securityDepositoryCenter') else None
        self.avatarUrl = data.get('avatarUrl')
        self.isEnableEsign = data.get('isEnableEsign')
        self.isSignBeforeBuy = data.get('isSignBeforeBuy')
        self.withdrawLimitSession = data.get('withdrawLimitSession')
        self.withdrawLimitDaily = data.get('withdrawLimitDaily')
        self.buySellLimitDaily = data.get('buySellLimitDaily')
    
    def to_dict(self):
        return {
            'id': self.id,
            'encodeURL': self.encodeURL,
            'code': self.code,
            'name': self.name,
            'userId': self.userId,
            'userCode': self.userCode,
            'email': self.email,
            'email2': self.email2,
            'shortName': self.shortName,
            'address1': self.address1,
            'phone': self.phone,
            'phonePostal': self.phonePostal,
            'website': self.website,
            'templateContract': self.templateContract,
            'hsbcCode': self.hsbcCode,
            'securityDepositoryCenter': self.securityDepositoryCenter.to_dict() if self.securityDepositoryCenter else None,
            'avatarUrl': self.avatarUrl,
            'isEnableEsign': self.isEnableEsign,
            'isSignBeforeBuy': self.isSignBeforeBuy,
            'withdrawLimitSession': self.withdrawLimitSession,
            'withdrawLimitDaily': self.withdrawLimitDaily,
            'buySellLimitDaily': self.buySellLimitDaily
        }
    
    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class SecurityDepositoryCenter:
    def __init__(self, data):
        self.id = data.get('id')
        self.code = data.get('code')
        self.name = data.get('name')
    
    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name
        }

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class FundType:
    def __init__(self, data):
        self.id = data.get('id')
        self.name = data.get('name')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class DataFundAssetType:
    def __init__(self, data):
        self.id = data.get('id')
        self.name = data.get('name')
        self.code = data.get('code')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code
        }

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class ProductFund:
    def __init__(self, data):
        self.id = data.get('id')
        self.ipoStartTime = data.get('ipoStartTime')
        self.ipoEndTime = data.get('ipoEndTime')
        self.issueAt = data.get('issueAt')
        self.surveyIpoTemplate = data.get('surveyIpoTemplate')
        self.isBuyByReward = data.get('isBuyByReward')
        self.updateAssetHoldingTime = data.get('updateAssetHoldingTime')
        self.ipoStatusCode = data.get('ipoStatusCode')
    
    def to_dict(self):
        return {
            'id': self.id,
            'ipoStartTime': self.ipoStartTime,
            'ipoEndTime': self.ipoEndTime,
            'issueAt': self.issueAt,
            'surveyIpoTemplate': self.surveyIpoTemplate,
            'isBuyByReward': self.isBuyByReward,
            'updateAssetHoldingTime': self.updateAssetHoldingTime,
            'ipoStatusCode': self.ipoStatusCode
        }
    
    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class ProductNavChange:
    def __init__(self, data):
        self.navToPrevious = data.get('navToPrevious')
        self.navToLastYear = data.get('navToLastYear')
        self.navToEstablish = data.get('navToEstablish')
        self.navTo1Months = data.get('navTo1Months')
        self.navTo3Months = data.get('navTo3Months')
        self.navTo6Months = data.get('navTo6Months')
        self.navTo12Months = data.get('navTo12Months')
        self.navTo24Months = data.get('navTo24Months')
        self.navTo36Months = data.get('navTo36Months')
        self.navTo60Months = data.get('navTo60Months')
        self.annualizedReturn36Months = data.get('annualizedReturn36Months')
        self.navToBeginning = data.get('navToBeginning')
        self.updateAt = data.get('updateAt')
    
    def to_dict(self):
        return {
            'navToPrevious': self.navToPrevious,
            'navToLastYear': self.navToLastYear,
            'navToEstablish': self.navToEstablish,
            'navTo1Months': self.navTo1Months,
            'navTo3Months': self.navTo3Months,
            'navTo6Months': self.navTo6Months,
            'navTo12Months': self.navTo12Months,
            'navTo24Months': self.navTo24Months,
            'navTo36Months': self.navTo36Months,
            'navTo60Months': self.navTo60Months,
            'annualizedReturn36Months': self.annualizedReturn36Months,
            'navToBeginning': self.navToBeginning,
            'updateAt': self.updateAt
        }
    
    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class Extra:
    def __init__(self, data):
        self.last_nav_date = data.get('lastNAVDate')
        self.last_nav = data.get('lastNAV')
        self.current_nav = data.get('currentNAV')
    
    def to_dict(self):
        return {
            'last_nav_date': self.last_nav_date,
            'last_nav': self.last_nav,
            'current_nav': self.current_nav
        }

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class NavHistory:
    def __init__(self, data):
        self.id = data.get('id')
        self.createdAt = data.get('createdAt')
        self.nav = data.get('nav')
        self.navDate = data.get('navDate')
        self.productId = data.get('productId')
    
    def to_dict(self):
        return {
            "id": self.id,
            "createdAt": self.createdAt,
            "nav": self.nav,
            "navDate": self.navDate,
            "productId": self.productId
        }

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)