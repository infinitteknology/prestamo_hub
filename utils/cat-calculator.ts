import type {
  AdditionalMandatoryFee,
  AmortizationRow,
  CashFlowEntry,
  CATCalculationResult,
  CATCalculatorFormValues,
  CATCalculatorMessages,
  FeeCollectionMethod,
  GeneratedCashFlowResult,
  PeriodDefinition,
  RepaymentFrequency,
  RepaymentMethod,
} from "@/types/cat-calculator"

const DAYS_IN_YEAR = 365
const DAYS_IN_MONTH = DAYS_IN_YEAR / 12
const MAX_IRR_ITERATIONS = 100
const IRR_TOLERANCE = 1e-10

type ScheduleChargeAllocation = {
  fee: number[]
  iva: number[]
  insurance: number[]
  upfrontFee: number
  upfrontIva: number
  upfrontInsurance: number
}

const DEFAULT_MESSAGES: CATCalculatorMessages = {
  frequencyLabels: {
    weekly: "Weekly",
    quincenal: "Quincenal",
    monthly: "Monthly",
    lump_sum_maturity: "Maturity",
  },
  frequencyPeriodLabels: {
    weekly: "Week",
    quincenal: "Two Weeks",
    monthly: "Month",
    lump_sum_maturity: "Maturity",
  },
  maturityLabel: "Maturity",
  paymentSuffix: "payment",
  finalPaymentLabel: "Final payment",
  descriptions: {
    loanDisbursement: "Loan disbursement",
    loanDisbursementNetOfCharges: "Loan disbursement net of upfront mandatory charges",
  },
  assumptions: {
    flatApr365:
      "Interest is calculated with a flat nominal APR on the original principal using a 365-day year.",
    averageMonth:
      "Month-based terms and monthly payments use an average month length of 365/12 days.",
  },
}

function roundToCurrency(value: number) {
  return Number(value.toFixed(2))
}

function getTotalDays(
  loanTerm: number,
  unit: CATCalculatorFormValues["loanTermUnit"],
) {
  switch (unit) {
    case "days":
      return loanTerm
    case "weeks":
      return loanTerm * 7
    case "two_weeks":
      return loanTerm * 14
    case "months":
      return loanTerm * DAYS_IN_MONTH
  }
}

function getIntervalDays(frequency: RepaymentFrequency) {
  switch (frequency) {
    case "weekly":
      return 7
    case "quincenal":
      return 14
    case "monthly":
      return DAYS_IN_MONTH
    case "lump_sum_maturity":
      return Infinity
  }
}

function getFrequencyPeriodLabel(
  frequency: RepaymentFrequency,
  messages: CATCalculatorMessages,
) {
  return messages.frequencyPeriodLabels[frequency]
}

function getPaymentLabel(
  frequency: RepaymentFrequency,
  repaymentMethod: RepaymentMethod,
  paymentNumber: number,
  messages: CATCalculatorMessages,
) {
  if (frequency === "lump_sum_maturity" || repaymentMethod === "lump_sum") {
    return messages.maturityLabel
  }

  return `${getFrequencyPeriodLabel(frequency, messages)} ${paymentNumber}`
}

function normalizeRepaymentMode(
  frequency: RepaymentFrequency,
  repaymentMethod: RepaymentMethod,
) {
  if (frequency === "lump_sum_maturity" || repaymentMethod === "lump_sum") {
    return {
      repaymentFrequency: "lump_sum_maturity" as const,
      repaymentMethod: "lump_sum" as const,
    }
  }

  return { repaymentFrequency: frequency, repaymentMethod }
}

function buildPeriods(
  totalDays: number,
  frequency: RepaymentFrequency,
  repaymentMethod: RepaymentMethod,
  messages: CATCalculatorMessages,
) {
  const normalized = normalizeRepaymentMode(frequency, repaymentMethod)

  if (normalized.repaymentMethod === "lump_sum") {
    return [
      {
        periodNumber: 1,
        startDay: 0,
        endDay: totalDays,
        daysInPeriod: totalDays,
        label: messages.maturityLabel,
      },
    ] satisfies PeriodDefinition[]
  }

  const intervalDays = getIntervalDays(normalized.repaymentFrequency)
  const periods: PeriodDefinition[] = []
  let currentDay = 0
  let periodNumber = 1

  while (currentDay < totalDays - 1e-9) {
    const nextDay = Math.min(totalDays, currentDay + intervalDays)

    periods.push({
      periodNumber,
      startDay: currentDay,
      endDay: nextDay,
      daysInPeriod: nextDay - currentDay,
      label: `${getFrequencyPeriodLabel(normalized.repaymentFrequency, messages)} ${periodNumber}`,
    })

    currentDay = nextDay
    periodNumber += 1
  }

  return periods
}

function calculateFlatInterest(
  principal: number,
  annualRatePercent: number,
  days: number,
) {
  return principal * (annualRatePercent / 100) * (days / DAYS_IN_YEAR)
}

function buildEqualDistribution(total: number, count: number) {
  if (count <= 0) return []

  const rawShare = total / count
  const values = Array.from({ length: count }, () => rawShare)
  let allocated = 0

  return values.map((value, index) => {
    if (index === count - 1) {
      return total - allocated
    }

    allocated += value
    return value
  })
}

function buildWeightedDistribution(total: number, weights: number[]) {
  if (weights.length === 0) return []

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  if (totalWeight <= 0) {
    return buildEqualDistribution(total, weights.length)
  }

  let allocated = 0

  return weights.map((weight, index) => {
    if (index === weights.length - 1) {
      return total - allocated
    }

    const value = total * (weight / totalWeight)
    allocated += value
    return value
  })
}

function addAllocatedCharge(
  target: number[],
  value: number,
  periodCount: number,
  method: FeeCollectionMethod,
) {
  if (value === 0 || periodCount <= 0) return 0

  if (method === "deducted_upfront") {
    return value
  }

  if (method === "paid_with_final_installment") {
    target[periodCount - 1] += value
    return 0
  }

  const allocation = buildEqualDistribution(value, periodCount)
  allocation.forEach((allocatedValue, index) => {
    target[index] += allocatedValue
  })
  return 0
}

function calculateFeeIva(amount: number, appliesIva: boolean, ivaRate: number) {
  if (!appliesIva || amount === 0) return 0
  return amount * (ivaRate / 100)
}

function getOriginationFee(input: CATCalculatorFormValues): AdditionalMandatoryFee {
  return {
    id: "origination",
    name: "Origination fee",
    amount: input.originationFee,
    collectionMethod: input.originationFeeCollectionMethod,
    subjectToIva: input.applyIvaToOriginationFee,
    ivaRate: input.ivaRate,
  }
}

function buildScheduleChargeAllocation(
  input: CATCalculatorFormValues,
  periodCount: number,
): ScheduleChargeAllocation {
  const fee = Array.from({ length: periodCount }, () => 0)
  const iva = Array.from({ length: periodCount }, () => 0)
  const insurance = Array.from({ length: periodCount }, () => 0)
  let upfrontFee = 0
  let upfrontIva = 0
  let upfrontInsurance = 0

  const mandatoryFees = [getOriginationFee(input), ...input.additionalFees]

  mandatoryFees.forEach((feeItem) => {
    const feeIva = calculateFeeIva(
      feeItem.amount,
      feeItem.subjectToIva,
      feeItem.ivaRate,
    )

    upfrontFee += addAllocatedCharge(
      fee,
      feeItem.amount,
      periodCount,
      feeItem.collectionMethod,
    )
    upfrontIva += addAllocatedCharge(
      iva,
      feeIva,
      periodCount,
      feeItem.collectionMethod,
    )
  })

  const insuranceIva = calculateFeeIva(
    input.mandatoryInsurance,
    input.insuranceSubjectToIva,
    input.ivaRate,
  )
  upfrontInsurance += addAllocatedCharge(
    insurance,
    input.mandatoryInsurance,
    periodCount,
    input.insuranceCollectionMethod,
  )
  upfrontIva += addAllocatedCharge(
    iva,
    insuranceIva,
    periodCount,
    input.insuranceCollectionMethod,
  )

  return {
    fee,
    iva,
    insurance,
    upfrontFee,
    upfrontIva,
    upfrontInsurance,
  }
}

export function calculateUpfrontDeductions(input: CATCalculatorFormValues) {
  const allocation = buildScheduleChargeAllocation(input, 1)

  return (
    allocation.upfrontFee +
    allocation.upfrontIva +
    allocation.upfrontInsurance
  )
}

export function calculatePayment(
  principal: number,
  totalInterest: number,
  periodCount: number,
) {
  if (periodCount <= 0) return 0
  return (principal + totalInterest) / periodCount
}

function buildBaseSchedule(
  input: CATCalculatorFormValues,
  periods: PeriodDefinition[],
  totalDays: number,
  messages: CATCalculatorMessages,
) {
  const normalized = normalizeRepaymentMode(
    input.repaymentFrequency,
    input.repaymentMethod,
  )
  const totalFlatInterest = calculateFlatInterest(
    input.loanAmount,
    input.annualInterestRate,
    totalDays,
  )

  if (normalized.repaymentMethod === "lump_sum") {
    return [
      {
        paymentNumber: 1,
        periodLabel: messages.maturityLabel,
        dayOffset: totalDays,
        principal: input.loanAmount,
        interest: totalFlatInterest,
        fee: 0,
        iva: 0,
        insurance: 0,
        remainingBalance: 0,
        payment: input.loanAmount + totalFlatInterest,
      },
    ] satisfies AmortizationRow[]
  }

  let balance = input.loanAmount
  const interestAllocation = buildWeightedDistribution(
    totalFlatInterest,
    periods.map((period) => period.daysInPeriod),
  )
  const basePayment = calculatePayment(
    input.loanAmount,
    totalFlatInterest,
    periods.length,
  )

  return periods.map((period, index) => {
    const interest = interestAllocation[index] ?? 0
    const principal =
      index === periods.length - 1
        ? balance
        : Math.min(balance, Math.max(basePayment - interest, 0))
    const payment = principal + interest

    balance = Math.max(balance - principal, 0)

    return {
      paymentNumber: period.periodNumber,
      periodLabel: getPaymentLabel(
        normalized.repaymentFrequency,
        normalized.repaymentMethod,
        period.periodNumber,
        messages,
      ),
      dayOffset: period.endDay,
      principal,
      interest,
      fee: 0,
      iva: 0,
      insurance: 0,
      remainingBalance: balance,
      payment,
    }
  })
}

export function generateRepaymentSchedule(
  input: CATCalculatorFormValues,
  messages: CATCalculatorMessages = DEFAULT_MESSAGES,
) {
  const totalDays = getTotalDays(input.loanTerm, input.loanTermUnit)
  const periods = buildPeriods(
    totalDays,
    input.repaymentFrequency,
    input.repaymentMethod,
    messages,
  )
  const baseSchedule = buildBaseSchedule(input, periods, totalDays, messages)
  const allocation = buildScheduleChargeAllocation(input, baseSchedule.length)

  return baseSchedule.map((row, index) => {
    const fee = allocation.fee[index] ?? 0
    const iva = allocation.iva[index] ?? 0
    const insurance = allocation.insurance[index] ?? 0

    return {
      ...row,
      fee,
      iva,
      insurance,
      payment: row.payment + fee + iva + insurance,
    }
  })
}

export function generateCashFlows(
  input: CATCalculatorFormValues,
  messages: CATCalculatorMessages = DEFAULT_MESSAGES,
): GeneratedCashFlowResult {
  const totalDays = getTotalDays(input.loanTerm, input.loanTermUnit)
  const schedule = generateRepaymentSchedule(input, messages)
  const allocation = buildScheduleChargeAllocation(input, schedule.length)
  const amountReceived =
    input.loanAmount -
    allocation.upfrontFee -
    allocation.upfrontIva -
    allocation.upfrontInsurance

  const cashFlows: CashFlowEntry[] = [
    {
      period: 0,
      dayOffset: 0,
      cashFlow: amountReceived,
      description:
        allocation.upfrontFee > 0 ||
        allocation.upfrontIva > 0 ||
        allocation.upfrontInsurance > 0
          ? messages.descriptions.loanDisbursementNetOfCharges
          : messages.descriptions.loanDisbursement,
    },
    ...schedule.map((row, index) => ({
      period: row.paymentNumber,
      dayOffset: row.dayOffset,
      cashFlow: -row.payment,
      description:
        index === schedule.length - 1 && row.periodLabel === messages.maturityLabel
          ? messages.finalPaymentLabel
          : `${row.periodLabel} ${messages.paymentSuffix}`,
    })),
  ]

  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)
  const totalFees =
    input.originationFee +
    input.additionalFees.reduce((sum, fee) => sum + fee.amount, 0)
  const insuranceIva = calculateFeeIva(
    input.mandatoryInsurance,
    input.insuranceSubjectToIva,
    input.ivaRate,
  )
  const totalFeeIva =
    calculateFeeIva(
      input.originationFee,
      input.applyIvaToOriginationFee,
      input.ivaRate,
    ) +
    input.additionalFees.reduce((sum, fee) => {
      return sum + calculateFeeIva(fee.amount, fee.subjectToIva, fee.ivaRate)
    }, 0)
  const ivaPaid = totalFeeIva + insuranceIva
  const totalRepayment = schedule.reduce((sum, row) => sum + row.payment, 0)
  const paymentPerPeriod =
    schedule.length > 0
      ? schedule.reduce((sum, row) => sum + row.payment, 0) / schedule.length
      : 0
  const effectiveBorrowingCost = totalRepayment - amountReceived
  const assumptions = [
    messages.assumptions.flatApr365,
    messages.assumptions.averageMonth,
  ]

  return {
    schedule: schedule.map((row) => ({
      ...row,
      principal: roundToCurrency(row.principal),
      interest: roundToCurrency(row.interest),
      fee: roundToCurrency(row.fee),
      iva: roundToCurrency(row.iva),
      insurance: roundToCurrency(row.insurance),
      remainingBalance: roundToCurrency(row.remainingBalance),
      payment: roundToCurrency(row.payment),
    })),
    cashFlows: cashFlows.map((entry) => ({
      ...entry,
      cashFlow: roundToCurrency(entry.cashFlow),
    })),
    amountReceived: roundToCurrency(amountReceived),
    totalInterest: roundToCurrency(totalInterest),
    totalFees: roundToCurrency(totalFees),
    ivaPaid: roundToCurrency(ivaPaid),
    insuranceCost: roundToCurrency(input.mandatoryInsurance),
    totalRepayment: roundToCurrency(totalRepayment),
    paymentPerPeriod: roundToCurrency(paymentPerPeriod),
    effectiveBorrowingCost: roundToCurrency(effectiveBorrowingCost),
    totalDays: roundToCurrency(totalDays),
    assumptions,
  }
}

export const generateCashFlow = generateCashFlows

function npv(ratePerDay: number, cashFlows: CashFlowEntry[]) {
  return cashFlows.reduce((sum, entry) => {
    return sum + entry.cashFlow / (1 + ratePerDay) ** entry.dayOffset
  }, 0)
}

function npvDerivative(ratePerDay: number, cashFlows: CashFlowEntry[]) {
  return cashFlows.reduce((sum, entry) => {
    if (entry.dayOffset === 0) return sum

    return (
      sum -
      (entry.dayOffset * entry.cashFlow) /
        (1 + ratePerDay) ** (entry.dayOffset + 1)
    )
  }, 0)
}

function calculateIRRByBisection(cashFlows: CashFlowEntry[]) {
  let low = -0.9999
  let high = 1
  let lowValue = npv(low, cashFlows)
  let highValue = npv(high, cashFlows)

  while (lowValue * highValue > 0 && high < 100) {
    high *= 2
    highValue = npv(high, cashFlows)
  }

  for (let iteration = 0; iteration < MAX_IRR_ITERATIONS; iteration += 1) {
    const mid = (low + high) / 2
    const midValue = npv(mid, cashFlows)

    if (Math.abs(midValue) <= IRR_TOLERANCE) {
      return mid
    }

    if (lowValue * midValue < 0) {
      high = mid
      highValue = midValue
    } else {
      low = mid
      lowValue = midValue
    }
  }

  return (low + high) / 2
}

export function calculateIRR(cashFlows: CashFlowEntry[]) {
  let guess = 0.001

  for (let iteration = 0; iteration < MAX_IRR_ITERATIONS; iteration += 1) {
    const value = npv(guess, cashFlows)

    if (Math.abs(value) <= IRR_TOLERANCE) {
      return guess
    }

    const derivative = npvDerivative(guess, cashFlows)

    if (Math.abs(derivative) <= IRR_TOLERANCE) {
      break
    }

    const nextGuess = guess - value / derivative

    if (!Number.isFinite(nextGuess) || nextGuess <= -0.9999) {
      break
    }

    if (Math.abs(nextGuess - guess) <= IRR_TOLERANCE) {
      return nextGuess
    }

    guess = nextGuess
  }

  return calculateIRRByBisection(cashFlows)
}

export function annualizeIRR(ratePerDay: number) {
  return (1 + ratePerDay) ** DAYS_IN_YEAR - 1
}

export function calculateCAT(
  input: CATCalculatorFormValues,
  messages: CATCalculatorMessages = DEFAULT_MESSAGES,
): CATCalculationResult {
  const generated = generateCashFlows(input, messages)

  /**
   * Banco de Mexico's CAT methodology is built from borrower cash flows.
   * We mirror that idea by finding the internal rate of return that makes the
   * net present value of all borrower cash flows equal to zero:
   *
   *   NPV(r) = sum(CF_t / (1 + r) ^ day_t) = 0
   *
   * Newton-Raphson iteratively improves the daily rate estimate with:
   *
   *   r_next = r - NPV(r) / NPV'(r)
   *
   * where NPV'(r) is the derivative of the discounted cash-flow equation.
   * If the derivative becomes unstable or the iteration diverges, we fall back
   * to bisection to keep the CAT estimate numerically robust.
   */
  const dailyIRR = calculateIRR(generated.cashFlows)
  const estimatedCAT = annualizeIRR(dailyIRR) * 100

  return {
    ...generated,
    dailyIRR,
    estimatedCAT: roundToCurrency(estimatedCAT),
  }
}
