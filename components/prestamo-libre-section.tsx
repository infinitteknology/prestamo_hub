"use client"

import Image from "next/image"
import { useLang } from "@/components/lang-provider"

export function PrestamoLibreSection() {
  const { t } = useLang()

  return (
    <section
      id="options"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid items-center gap-10 p-6 md:grid-cols-2 md:p-10">
            <div className="order-2 md:order-1">
              <div className="overflow-hidden rounded-2xl border border-border bg-background">
                <Image
                  src="/index.png"
                  alt={t.prestamoLibre.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                {t.prestamoLibre.kicker}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                {t.prestamoLibre.title}
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                {t.prestamoLibre.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

