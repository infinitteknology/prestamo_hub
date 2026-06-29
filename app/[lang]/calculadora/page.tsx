import { notFound } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Calculator } from "@/components/calculator"
import type { Lang } from "@/lib/translations"

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
