"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLang } from "@/components/lang-provider"

export function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl">
          {t.faq.title}
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
