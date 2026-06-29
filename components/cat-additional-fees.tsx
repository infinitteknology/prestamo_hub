"use client"

import { Plus, Trash2 } from "lucide-react"
import type { FieldErrors, UseFieldArrayReturn, UseFormRegister } from "react-hook-form"
import type { Translation } from "@/lib/translations"
import type { CATCalculatorFormValues } from "@/types/cat-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

type Props = {
  calc: Translation["calc"]
  register: UseFormRegister<CATCalculatorFormValues>
  errors: FieldErrors<CATCalculatorFormValues>
  additionalFees: UseFieldArrayReturn<
    CATCalculatorFormValues,
    "additionalFees",
    "fieldKey"
  >
  onAddFee: () => void
}

export function CATAdditionalFees({
  calc,
  register,
  errors,
  additionalFees,
  onAddFee,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-background/60 p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {calc.additionalFeesTitle}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {calc.additionalFeesSubtitle}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 rounded-xl px-4"
          onClick={onAddFee}
        >
          <Plus className="size-4" />
          {calc.addFee}
        </Button>
      </div>

      {additionalFees.fields.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
          {calc.noAdditionalFees}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {additionalFees.fields.map((field, index) => {
            const itemErrors = errors.additionalFees?.[index]

            return (
              <div
                key={field.fieldKey}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`additionalFees.${index}.name`}>
                      {calc.additionalFeeName}
                    </Label>
                    <Input
                      id={`additionalFees.${index}.name`}
                      className="mt-2"
                      {...register(`additionalFees.${index}.name`)}
                    />
                    {itemErrors?.name?.message ? (
                      <p className="mt-2 text-xs text-destructive">
                        {itemErrors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor={`additionalFees.${index}.amount`}>
                      {calc.additionalFeeAmount}
                    </Label>
                    <Input
                      id={`additionalFees.${index}.amount`}
                      type="number"
                      min={0}
                      step={1}
                      className="mt-2"
                      {...register(`additionalFees.${index}.amount`)}
                    />
                    {itemErrors?.amount?.message ? (
                      <p className="mt-2 text-xs text-destructive">
                        {itemErrors.amount.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor={`additionalFees.${index}.collectionMethod`}>
                      {calc.additionalFeeTiming}
                    </Label>
                    <Select
                      id={`additionalFees.${index}.collectionMethod`}
                      className="mt-2"
                      {...register(`additionalFees.${index}.collectionMethod`)}
                    >
                      <option value="deducted_upfront">
                        {calc.feeDeductedUpfront}
                      </option>
                      <option value="added_each_installment">
                        {calc.feeAddedEachInstallment}
                      </option>
                      <option value="paid_with_final_installment">
                        {calc.feePaidWithFinalInstallment}
                      </option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`additionalFees.${index}.ivaRate`}>
                      {calc.additionalFeeIvaRate}
                    </Label>
                    <Input
                      id={`additionalFees.${index}.ivaRate`}
                      type="number"
                      min={0}
                      step={1}
                      className="mt-2"
                      {...register(`additionalFees.${index}.ivaRate`)}
                    />
                    {itemErrors?.ivaRate?.message ? (
                      <p className="mt-2 text-xs text-destructive">
                        {itemErrors.ivaRate.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-between gap-3">
                    <label
                      htmlFor={`additionalFees.${index}.subjectToIva`}
                      className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-background px-3"
                    >
                      <input
                        id={`additionalFees.${index}.subjectToIva`}
                        type="checkbox"
                        className="size-4 rounded border-border accent-[var(--primary)]"
                        {...register(`additionalFees.${index}.subjectToIva`)}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {calc.additionalFeeSubjectToIva}
                      </span>
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 rounded-xl justify-start px-3 text-destructive hover:text-destructive"
                      onClick={() => additionalFees.remove(index)}
                    >
                      <Trash2 className="size-4" />
                      {calc.removeFee}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
