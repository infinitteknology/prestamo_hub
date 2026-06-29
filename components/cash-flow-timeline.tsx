"use client"

import { formatCurrency } from "@/utils/format"

type Props = {
  locale: string
  title: string
  subtitle: string
  loanLabel: string
  receivedLabel: string
  periodicPaymentsLabel: string
  finalPaymentLabel: string
  amountReceived: number
  paymentPerPeriod: number
  finalPayment: number
}

export function CashFlowTimeline({
  locale,
  title,
  subtitle,
  loanLabel,
  receivedLabel,
  periodicPaymentsLabel,
  finalPaymentLabel,
  amountReceived,
  paymentPerPeriod,
  finalPayment,
}: Props) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[720px]">
          <svg viewBox="0 0 720 170" className="h-auto w-full" role="img" aria-label={title}>
            <defs>
              <linearGradient id="timeline-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.28)" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>

            <line
              x1="110"
              y1="78"
              x2="610"
              y2="78"
              stroke="url(#timeline-line)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {[
              { x: 110, label: loanLabel, amount: "" },
              {
                x: 250,
                label: receivedLabel,
                amount: formatCurrency(amountReceived, locale),
              },
              {
                x: 430,
                label: periodicPaymentsLabel,
                amount: formatCurrency(paymentPerPeriod, locale),
              },
              {
                x: 610,
                label: finalPaymentLabel,
                amount: formatCurrency(finalPayment, locale),
              },
            ].map((item, index) => (
              <g key={`${item.label}-${index}`}>
                <circle
                  cx={item.x}
                  cy="78"
                  r={index === 0 ? 12 : 16}
                  fill={index === 0 ? "hsl(var(--muted))" : "hsl(var(--primary))"}
                />
                <text
                  x={item.x}
                  y="122"
                  textAnchor="middle"
                  className="fill-foreground text-[13px] font-semibold"
                >
                  {item.label}
                </text>
                {item.amount ? (
                  <text
                    x={item.x}
                    y="142"
                    textAnchor="middle"
                    className="fill-muted-foreground text-[12px]"
                  >
                    {item.amount}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
