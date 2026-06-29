"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { FieldErrors, Path } from "react-hook-form"
import { ArrowRight, Loader2 } from "lucide-react"
import { CATAdditionalFees } from "@/components/cat-additional-fees"
import { GooglePlayButton } from "@/components/google-play-button"
import { useLang } from "@/components/lang-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  createAdditionalFee,
  getRepaymentFrequencyFromTermUnit,
  useCATCalculator,
} from "@/hooks/use-cat-calculator"
import type { CATCalculatorFormValues } from "@/types/cat-calculator"
import { formatCurrency, formatPercent } from "@/utils/format"

type FieldConfig = {
  name: Path<CATCalculatorFormValues>
  label: string
  type?: "number"
  step?: number
  min?: number
}

function FieldError({
  errors,
  name,
}: {
  errors: FieldErrors<CATCalculatorFormValues>
  name: Path<CATCalculatorFormValues>
}) {
  const message = errors[name]?.message

  if (!message || typeof message !== "string") {
    return null
  }

  return <p className="mt-2 text-xs text-destructive">{message}</p>
}

function DataCard({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: string
  tone?: "default" | "highlight"
}) {
  return (
    <div
      className={
        tone === "highlight"
          ? "rounded-2xl bg-primary px-5 py-4 text-primary-foreground"
          : "rounded-2xl border border-border bg-background/70 px-5 py-4"
      }
    >
      <p className={tone === "highlight" ? "text-sm text-primary-foreground/80" : "text-sm text-muted-foreground"}>
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
        {value}
      </p>
    </div>
  )
}

function TableSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function CheckboxField({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 items-center gap-3 rounded-xl border border-input bg-background px-3 py-2 shadow-sm"
    >
      {children}
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint ? (
          <span className="text-xs leading-5 text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </label>
  )
}

function AdvancedCATContent() {
  const { t, lang } = useLang()
  const locale = lang === "es" ? "es-MX" : "en-US"
  const { form, additionalFees, result, isCalculating, handleCalculate } = useCATCalculator(
    t.calc,
  )
  const {
    register,
    formState: { errors },
  } = form
  const watchedLoanTermUnit = form.watch("loanTermUnit")
  const watchedRepaymentMethod = form.watch("repaymentMethod")
  const derivedRepaymentFrequency = getRepaymentFrequencyFromTermUnit(
    watchedLoanTermUnit,
  )
  const isDayTerm = watchedLoanTermUnit === "days"
  const finalScheduledPayment =
    result.schedule[result.schedule.length - 1]?.payment ?? result.paymentPerPeriod

  const signedCurrency = (value: number) => {
    const formatted = formatCurrency(Math.abs(value), locale)
    return value >= 0 ? `+${formatted}` : `-${formatted}`
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm md:p-7">
          <form className="space-y-6" onSubmit={handleCalculate}>
            <div className="rounded-2xl border border-border bg-background/60 p-4 md:p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  {t.calc.basicInputsTitle}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.calc.basicInputsSubtitle}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    {
                      name: "loanAmount",
                      label: t.calc.loanAmount,
                      type: "number",
                      step: 1,
                      min: 1,
                    },
                    {
                      name: "annualInterestRate",
                      label: t.calc.annualInterestRate,
                      type: "number",
                      step: 0.1,
                      min: 0,
                    },
                    {
                      name: "loanTerm",
                      label: t.calc.loanTerm,
                      type: "number",
                      step: 1,
                      min: 1,
                    },
                  ] satisfies FieldConfig[]
                ).map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      min={field.min}
                      step={field.step}
                      className="mt-2"
                      {...register(field.name)}
                    />
                    <FieldError errors={errors} name={field.name} />
                  </div>
                ))}

                <div>
                  <Label htmlFor="loanTermUnit">{t.calc.loanTermUnit}</Label>
                  <Select
                    id="loanTermUnit"
                    className="mt-2"
                    {...register("loanTermUnit")}
                  >
                    <option value="days">{t.calc.days}</option>
                    <option value="weeks">{t.calc.weeks}</option>
                    <option value="two_weeks">{t.calc.twoWeeks}</option>
                    <option value="months">{t.calc.months}</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="repayment-cycle-auto">
                    {t.calc.repaymentCycleAuto}
                  </Label>
                  <div
                    id="repayment-cycle-auto"
                    className="mt-2 flex h-11 items-center rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                  >
                    {{
                      weekly: t.calc.frequencyWeekly,
                      quincenal: t.calc.frequencyQuincenal,
                      monthly: t.calc.frequencyMonthly,
                      lump_sum_maturity: t.calc.frequencyMaturity,
                    }[derivedRepaymentFrequency]}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {isDayTerm
                      ? t.calc.dayTermRepaymentHint
                      : t.calc.repaymentCycleHint}
                  </p>
                </div>

                <div>
                  <Label htmlFor="repaymentMethod">{t.calc.repaymentMethod}</Label>
                  <Select
                    id="repaymentMethod"
                    className="mt-2"
                    disabled={isDayTerm}
                    {...register("repaymentMethod")}
                  >
                    <option value="equal_payments">
                      {t.calc.repaymentEqualPayments}
                    </option>
                    <option value="lump_sum">{t.calc.repaymentLumpSum}</option>
                  </Select>
                  {isDayTerm ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t.calc.dayTermRepaymentHint}
                    </p>
                  ) : watchedRepaymentMethod === "lump_sum" ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t.calc.frequencyMaturity}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-4 md:p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  {t.calc.loanFeesTitle}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.calc.loanFeesSubtitle}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="originationFee">{t.calc.originationFee}</Label>
                    <Input
                      id="originationFee"
                      type="number"
                      min={0}
                      step={1}
                      className="mt-2"
                      {...register("originationFee")}
                    />
                    <FieldError errors={errors} name="originationFee" />
                  </div>

                  <div>
                    <Label htmlFor="originationFeeCollectionMethod">
                      {t.calc.originationFeeCollectionMethod}
                    </Label>
                    <Select
                      id="originationFeeCollectionMethod"
                      className="mt-2"
                      {...register("originationFeeCollectionMethod")}
                    >
                      <option value="deducted_upfront">{t.calc.feeDeductedUpfront}</option>
                      <option value="added_each_installment">
                        {t.calc.feeAddedEachInstallment}
                      </option>
                      <option value="paid_with_final_installment">
                        {t.calc.feePaidWithFinalInstallment}
                      </option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ivaRate">{t.calc.ivaRate}</Label>
                    <Input
                      id="ivaRate"
                      type="number"
                      min={0}
                      step={1}
                      className="mt-2"
                      {...register("ivaRate")}
                    />
                    <FieldError errors={errors} name="ivaRate" />
                  </div>

                  <CheckboxField
                    id="applyIvaToOriginationFee"
                    label={t.calc.applyIvaToOriginationFee}
                  >
                    <input
                      id="applyIvaToOriginationFee"
                      type="checkbox"
                      className="size-4 rounded border-border accent-[var(--primary)]"
                      {...register("applyIvaToOriginationFee")}
                    />
                  </CheckboxField>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mandatoryInsurance">{t.calc.mandatoryInsurance}</Label>
                    <Input
                      id="mandatoryInsurance"
                      type="number"
                      min={0}
                      step={1}
                      className="mt-2"
                      {...register("mandatoryInsurance")}
                    />
                    <FieldError errors={errors} name="mandatoryInsurance" />
                  </div>

                  <div>
                    <Label htmlFor="insuranceCollectionMethod">
                      {t.calc.insuranceCollectionMethod}
                    </Label>
                    <Select
                      id="insuranceCollectionMethod"
                      className="mt-2"
                      {...register("insuranceCollectionMethod")}
                    >
                      <option value="deducted_upfront">{t.calc.feeDeductedUpfront}</option>
                      <option value="added_each_installment">
                        {t.calc.feeAddedEachInstallment}
                      </option>
                      <option value="paid_with_final_installment">
                        {t.calc.feePaidWithFinalInstallment}
                      </option>
                    </Select>
                  </div>

                  <CheckboxField
                    id="insuranceSubjectToIva"
                    label={t.calc.insuranceSubjectToIva}
                  >
                    <input
                      id="insuranceSubjectToIva"
                      type="checkbox"
                      className="size-4 rounded border-border accent-[var(--primary)]"
                      {...register("insuranceSubjectToIva")}
                    />
                  </CheckboxField>
                </div>
              </div>
            </div>

            <CATAdditionalFees
              calc={t.calc}
              register={register}
              errors={errors}
              additionalFees={additionalFees}
              onAddFee={() => additionalFees.append(createAdditionalFee())}
            />

            {errors.loanAmount?.message ? (
              <p className="text-sm text-destructive">{errors.loanAmount.message}</p>
            ) : null}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl text-sm font-semibold md:w-auto md:min-w-52"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {t.calc.calculating}
                  </span>
                ) : (
                  t.calc.calculate
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] bg-primary p-6 text-primary-foreground shadow-sm md:p-7">
            <p className="text-sm text-primary-foreground/80">
              {t.calc.estimatedCAT}
            </p>
            <p className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {formatPercent(result.estimatedCAT, locale)}%
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/85">
              {t.calc.summaryNote}
            </p>
            <div className="mt-5">
              <GooglePlayButton
                label={t.calc.cta}
                meta={t.calc.downloadMeta}
                className="justify-center md:justify-start"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DataCard
              label={t.calc.amountReceived}
              value={formatCurrency(result.amountReceived, locale)}
              tone="highlight"
            />
            <DataCard
              label={t.calc.paymentPerPeriod}
              value={formatCurrency(result.paymentPerPeriod, locale)}
            />
            <DataCard
              label={t.calc.totalInterest}
              value={formatCurrency(result.totalInterest, locale)}
            />
            <DataCard
              label={t.calc.totalFees}
              value={formatCurrency(result.totalFees, locale)}
            />
            <DataCard
              label={t.calc.ivaPaid}
              value={formatCurrency(result.ivaPaid, locale)}
            />
            <DataCard
              label={t.calc.insuranceCost}
              value={formatCurrency(result.insuranceCost, locale)}
            />
            <DataCard
              label={t.calc.totalRepayment}
              value={formatCurrency(result.totalRepayment, locale)}
            />
            <DataCard
              label={t.calc.effectiveBorrowingCost}
              value={formatCurrency(result.effectiveBorrowingCost, locale)}
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{t.calc.assumptionsTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {t.calc.assumptionsSubtitle}
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {result.assumptions.map((assumption) => (
                <li key={assumption} className="rounded-2xl bg-muted/50 px-4 py-3">
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <div className="rounded-[28px] border border-[#2ecc71]/20 bg-[linear-gradient(180deg,rgba(46,204,113,0.10),rgba(46,204,113,0.04))] p-6 md:p-8">
          <p className="max-w-4xl text-base leading-8 text-foreground/85 md:text-lg">
            {t.calc.blogGuideSubtitle}
          </p>
          <Link
            href={`/${lang}/blog/calculadora-cat-mx`}
            className="mt-5 inline-flex items-center gap-2 text-lg font-semibold text-[#67c66b] underline-offset-4 transition-colors hover:text-[#2ecc71] hover:underline"
          >
            {t.calc.blogGuideCta}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
        <h3 className="text-xl font-semibold tracking-tight">
          {t.calc.disclaimerTitle}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {t.calc.disclaimer}
        </p>
      </div>

      <div className="space-y-6">
        <TableSection
          title={t.calc.amortizationTitle}
          subtitle={t.calc.amortizationSubtitle}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 font-medium">{t.calc.paymentNumber}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.datePeriod}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.principal}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.interest}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.fee}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.ivaPaid}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.insuranceCost}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.remainingBalance}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.payment}</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.length > 0 ? (
                  result.schedule.map((row) => (
                    <tr key={row.paymentNumber} className="border-b border-border/70">
                      <td className="px-3 py-3 align-top font-medium text-foreground">
                        {row.paymentNumber}
                      </td>
                      <td className="px-3 py-3 align-top text-muted-foreground">
                          {row.periodLabel}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.principal, locale)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.interest, locale)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.fee, locale)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.iva, locale)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.insurance, locale)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {formatCurrency(row.remainingBalance, locale)}
                      </td>
                      <td className="px-3 py-3 align-top font-medium text-foreground">
                        {formatCurrency(row.payment, locale)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">
                      {t.calc.emptyTable}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableSection>

        <TableSection title={t.calc.cashFlowTitle} subtitle={t.calc.cashFlowSubtitle}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 font-medium">{t.calc.period}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.cashFlow}</th>
                  <th className="px-3 py-3 font-medium">{t.calc.description}</th>
                </tr>
              </thead>
              <tbody>
                {result.cashFlows.length > 0 ? (
                  result.cashFlows.map((entry) => (
                    <tr key={`${entry.period}-${entry.dayOffset}`} className="border-b border-border/70">
                      <td className="px-3 py-3 align-top font-medium text-foreground">
                        {entry.period}
                      </td>
                      <td
                        className={`px-3 py-3 align-top font-medium ${
                          entry.cashFlow >= 0 ? "text-emerald-600" : "text-foreground"
                        }`}
                      >
                        {signedCurrency(entry.cashFlow)}
                      </td>
                      <td className="px-3 py-3 align-top text-muted-foreground">
                        {entry.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      {t.calc.emptyTable}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableSection>
      </div>
    </div>
  )
}

export function Calculator() {
  const { t, lang } = useLang()
  const locale = lang === "es" ? "es-MX" : "en-US"
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState(10000)
  const [term, setTerm] = useState(180)
  const [rate, setRate] = useState(36)
  const activeCalculator =
    searchParams.get("calculator") === "advanced" ? "advanced" : "simple"

  const { interest, total } = useMemo(() => {
    const apr = rate / 100
    const computedInterest = amount * apr * (term / 365)
    return {
      interest: computedInterest,
      total: amount + computedInterest,
    }
  }, [amount, rate, term])

  const setCalculatorMode = (mode: "simple" | "advanced") => {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === "advanced") {
      params.set("calculator", "advanced")
    } else {
      params.delete("calculator")
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <section id="calculator" className="finance-theme bg-background py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {t.calc.title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {t.calc.subtitle}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCalculator === "simple"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setCalculatorMode("simple")}
            >
              {t.calc.simpleTitle}
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCalculator === "advanced"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setCalculatorMode("advanced")}
            >
              {t.calc.advancedTitle}
            </button>
          </div>
        </div>

        {activeCalculator === "simple" ? (
          <div className="mt-12 grid gap-8 rounded-3xl border border-border bg-card p-6 md:grid-cols-2 md:p-10">
            <div className="flex flex-col gap-7">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="simple-amount">{t.calc.amount}</Label>
                  <span className="text-sm font-bold text-primary">
                    {formatCurrency(amount, locale)}
                  </span>
                </div>
                <input
                  id="simple-amount"
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-3 w-full accent-[var(--primary)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="simple-term">{t.calc.term}</Label>
                  <span className="text-sm font-bold text-primary">
                    {term} {lang === "es" ? "días" : "days"}
                  </span>
                </div>
                <input
                  id="simple-term"
                  type="range"
                  min={61}
                  max={365}
                  step={1}
                  value={term}
                  onChange={(event) => setTerm(Number(event.target.value))}
                  className="mt-3 w-full accent-[var(--primary)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="simple-rate">{t.calc.rate}</Label>
                  <span className="text-sm font-bold text-primary">
                    {formatPercent(rate, locale)}%
                  </span>
                </div>
                <input
                  id="simple-rate"
                  type="range"
                  min={0}
                  max={500}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="mt-3 w-full accent-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary p-6 text-primary-foreground">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-sm opacity-80">{t.calc.interest}</p>
                  <p className="text-3xl font-bold md:text-4xl">
                    {formatCurrency(interest, locale)}
                  </p>
                </div>
                <div className="h-px bg-primary-foreground/20" />
                <div>
                  <p className="text-sm opacity-80">{t.calc.total}</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(total, locale)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed opacity-80">
                  {t.calc.simpleDisclaimer}
                </p>
                <GooglePlayButton
                  label={t.calc.cta}
                  meta={t.calc.downloadMeta}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <AdvancedCATContent />
          </div>
        )}
      </div>
    </section>
  )
}

export const CATCalculator = AdvancedCATContent
