export type LoanTermUnit = "days" | "weeks" | "two_weeks" | "months"

export type RepaymentFrequency =
  | "weekly"
  | "quincenal"
  | "monthly"
  | "lump_sum_maturity"

export type FeeCollectionMethod =
  | "deducted_upfront"
  | "added_each_installment"
  | "paid_with_final_installment"

export type RepaymentMethod =
  | "equal_payments"
  | "lump_sum"

export type AdditionalMandatoryFee = {
  id: string
  name: string
  amount: number
  collectionMethod: FeeCollectionMethod
  subjectToIva: boolean
  ivaRate: number
}

export type CATCalculatorMessages = {
  frequencyLabels: Record<RepaymentFrequency, string>
  frequencyPeriodLabels: Record<RepaymentFrequency, string>
  maturityLabel: string
  paymentSuffix: string
  finalPaymentLabel: string
  descriptions: {
    loanDisbursement: string
    loanDisbursementNetOfCharges: string
  }
  assumptions: {
    flatApr365: string
    averageMonth: string
  }
}

export type CATCalculatorFormValues = {
  loanAmount: number
  annualInterestRate: number
  loanTerm: number
  loanTermUnit: LoanTermUnit
  originationFee: number
  originationFeeCollectionMethod: FeeCollectionMethod
  applyIvaToOriginationFee: boolean
  ivaRate: number
  mandatoryInsurance: number
  insuranceCollectionMethod: FeeCollectionMethod
  insuranceSubjectToIva: boolean
  repaymentFrequency: RepaymentFrequency
  repaymentMethod: RepaymentMethod
  additionalFees: AdditionalMandatoryFee[]
}

export type PeriodDefinition = {
  periodNumber: number
  startDay: number
  endDay: number
  daysInPeriod: number
  label: string
}

export type AmortizationRow = {
  paymentNumber: number
  periodLabel: string
  dayOffset: number
  principal: number
  interest: number
  fee: number
  iva: number
  insurance: number
  remainingBalance: number
  payment: number
}

export type CashFlowEntry = {
  period: number
  dayOffset: number
  cashFlow: number
  description: string
}

export type GeneratedCashFlowResult = {
  schedule: AmortizationRow[]
  cashFlows: CashFlowEntry[]
  amountReceived: number
  totalInterest: number
  totalFees: number
  ivaPaid: number
  insuranceCost: number
  totalRepayment: number
  paymentPerPeriod: number
  effectiveBorrowingCost: number
  totalDays: number
  assumptions: string[]
}

export type CATCalculationResult = GeneratedCashFlowResult & {
  estimatedCAT: number
  dailyIRR: number
}
