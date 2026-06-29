"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import type { Translation } from "@/lib/translations"
import type {
  AdditionalMandatoryFee,
  CATCalculationResult,
  CATCalculatorFormValues,
  CATCalculatorMessages,
} from "@/types/cat-calculator"
import { calculateCAT, calculateUpfrontDeductions } from "@/utils/cat-calculator"

const MIN_LOADING_MS = 180

function createAdditionalFeeSchema(calc: Translation["calc"]) {
  return z.object({
    id: z.string().min(1),
    name: z.string().trim().min(1, calc.validationAdditionalFeeName),
    amount: z.coerce.number().min(0, calc.validationFee),
    collectionMethod: z.enum([
      "deducted_upfront",
      "added_each_installment",
      "paid_with_final_installment",
    ]),
    subjectToIva: z.boolean(),
    ivaRate: z.coerce.number().min(0, calc.validationIva).max(100, calc.validationIva),
  })
}

export function createAdditionalFee() {
  return {
    id: crypto.randomUUID(),
    name: "",
    amount: 0,
    collectionMethod: "deducted_upfront",
    subjectToIva: true,
    ivaRate: 16,
  } satisfies AdditionalMandatoryFee
}

export function createCATCalculatorSchema(calc: Translation["calc"]) {
  return z
    .object({
      loanAmount: z.coerce.number().positive(calc.validationLoanAmount),
      annualInterestRate: z.coerce
        .number()
        .min(0, calc.validationInterestRate),
      loanTerm: z.coerce.number().positive(calc.validationLoanTerm),
      loanTermUnit: z.enum(["days", "weeks", "two_weeks", "months"]),
      originationFee: z.coerce.number().min(0, calc.validationFee),
      originationFeeCollectionMethod: z.enum([
        "deducted_upfront",
        "added_each_installment",
        "paid_with_final_installment",
      ]),
      applyIvaToOriginationFee: z.boolean(),
      ivaRate: z.coerce
        .number()
        .min(0, calc.validationIva)
        .max(100, calc.validationIva),
      mandatoryInsurance: z.coerce
        .number()
        .min(0, calc.validationInsurance),
      insuranceCollectionMethod: z.enum([
        "deducted_upfront",
        "added_each_installment",
        "paid_with_final_installment",
      ]),
      insuranceSubjectToIva: z.boolean(),
      repaymentFrequency: z.enum([
        "weekly",
        "quincenal",
        "monthly",
        "lump_sum_maturity",
      ]),
      repaymentMethod: z.enum([
        "equal_payments",
        "lump_sum",
      ]),
      additionalFees: z.array(createAdditionalFeeSchema(calc)),
    })
    .superRefine((values, ctx) => {
      if (values.loanAmount <= calculateUpfrontDeductions(values)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["loanAmount"],
          message: calc.validationNetDisbursement,
        })
      }
    })
}

export const defaultCATCalculatorValues: CATCalculatorFormValues = {
  loanAmount: 10000,
  annualInterestRate: 36,
  loanTerm: 12,
  loanTermUnit: "months",
  originationFee: 0,
  originationFeeCollectionMethod: "deducted_upfront",
  applyIvaToOriginationFee: true,
  ivaRate: 16,
  mandatoryInsurance: 0,
  insuranceCollectionMethod: "deducted_upfront",
  insuranceSubjectToIva: false,
  repaymentFrequency: "monthly",
  repaymentMethod: "equal_payments",
  additionalFees: [],
}

export function getCATCalculatorMessages(
  calc: Translation["calc"],
): CATCalculatorMessages {
  return {
    frequencyLabels: {
      weekly: calc.frequencyWeekly,
      quincenal: calc.frequencyQuincenal,
      monthly: calc.frequencyMonthly,
      lump_sum_maturity: calc.frequencyMaturity,
    },
    frequencyPeriodLabels: {
      weekly: calc.frequencyWeeklySingular,
      quincenal: calc.frequencyQuincenalSingular,
      monthly: calc.frequencyMonthlySingular,
      lump_sum_maturity: calc.frequencyMaturity,
    },
    maturityLabel: calc.frequencyMaturity,
    paymentSuffix: calc.paymentSuffix,
    descriptions: {
      loanDisbursement: calc.cashFlowDisbursement,
      loanDisbursementNetOfCharges: calc.cashFlowDisbursementNet,
    },
    assumptions: {
      flatApr365: calc.assumptionFlatApr365,
      averageMonth: calc.assumptionAverageMonth,
    },
    finalPaymentLabel: calc.finalPaymentLabel,
  }
}

export function getRepaymentFrequencyFromTermUnit(
  loanTermUnit: CATCalculatorFormValues["loanTermUnit"],
): CATCalculatorFormValues["repaymentFrequency"] {
  switch (loanTermUnit) {
    case "days":
      return "lump_sum_maturity"
    case "weeks":
      return "weekly"
    case "two_weeks":
      return "quincenal"
    case "months":
      return "monthly"
  }
}

export function useCATCalculator(calc: Translation["calc"]) {
  const messages = useMemo(() => getCATCalculatorMessages(calc), [calc])
  const schema = useMemo(() => createCATCalculatorSchema(calc), [calc])
  const form = useForm<CATCalculatorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultCATCalculatorValues,
    mode: "onBlur",
  })
  const additionalFees = useFieldArray({
    control: form.control,
    name: "additionalFees",
    keyName: "fieldKey",
  })
  const watchedLoanTermUnit = useWatch({
    control: form.control,
    name: "loanTermUnit",
  })
  const [result, setResult] = useState<CATCalculationResult>(() =>
    calculateCAT(defaultCATCalculatorValues, messages),
  )
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const repaymentFrequency = getRepaymentFrequencyFromTermUnit(watchedLoanTermUnit)
    const currentRepaymentMethod = form.getValues("repaymentMethod")

    form.setValue("repaymentFrequency", repaymentFrequency, {
      shouldDirty: true,
      shouldValidate: true,
    })

    if (watchedLoanTermUnit === "days") {
      form.setValue("repaymentMethod", "lump_sum", {
        shouldDirty: true,
        shouldValidate: true,
      })
      return
    }

    if (currentRepaymentMethod === "lump_sum") {
      form.setValue("repaymentMethod", "equal_payments", {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [form, watchedLoanTermUnit])

  useEffect(() => {
    setResult(calculateCAT(form.getValues(), messages))
  }, [form, messages])

  const handleCalculate = form.handleSubmit(async (values) => {
    setIsCalculating(true)

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, MIN_LOADING_MS)
      })
      setResult(calculateCAT(values, messages))
    } finally {
      setIsCalculating(false)
    }
  })

  return {
    form,
    additionalFees,
    result,
    isCalculating,
    handleCalculate,
  }
}
