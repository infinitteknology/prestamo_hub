import { notFound } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Calculator } from "@/components/calculator"
import type { Lang } from "@/lib/translations"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isSpanish = lang === "es"
  const title = isSpanish
    ? "Calculadora de préstamos en México | Calcula CAT, pagos y más"
    : "Mexico Loan Calculator | Calculate CAT, payments and more"
  const description = isSpanish
    ? "Calculadora de préstamos personales en México. Estima pagos, CAT, comisiones, IVA y seguro antes de solicitar un crédito."
    : "Personal loan calculator for Mexico. Estimate payments, CAT, fees, IVA and insurance before applying for credit."
  const keywords = isSpanish
    ? "calculadora de préstamos, préstamos en México, CAT, calculadora créditos México, préstamos personales México, calculadora CAT México"
    : "loan calculator, Mexico loans, CAT, loan calculator Mexico, personal loans Mexico, CAT calculator Mexico"
  
  return {
    title,
    description,
    keywords,
  }
}

export default async function CalculadoraPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") notFound()
  return (
    <LangProvider lang={lang as Lang}>
      <SiteHeader />
      <main>
        <Calculator />
      </main>
      <SiteFooter />
    </LangProvider>
  )
}
