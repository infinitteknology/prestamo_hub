"use client"

import Image from "next/image"
import { useLang } from "@/components/lang-provider"
import { PLAY_STORE_URL } from "@/lib/translations"

export function FinalCta() {
  const { t } = useLang()
  return (
    <section className="finance-theme py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-3xl border border-border bg-secondary/40 shadow-sm transition-transform hover:-translate-y-1"
          aria-label={t.cta.button}
        >
          <Image
            src="/final.png"
            alt={t.cta.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
          />
        </a>
      </div>
    </section>
  )
}
