"use client"

import { createContext, useContext, type ReactNode } from "react"
import { translations, type Lang, type Translation } from "@/lib/translations"

type LangContextValue = {
  lang: Lang
  t: Translation
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang
  children: ReactNode
}) {
  const value: LangContextValue = {
    lang,
    t: translations[lang] as Translation,
  }
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used within LangProvider")
  return ctx
}
