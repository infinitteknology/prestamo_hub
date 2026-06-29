import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { AppHighlights } from "@/components/app-highlights"
import { PrestamoLibreSection } from "@/components/prestamo-libre-section"
import { HowItWorks } from "@/components/how-it-works"
import { KeywordLinks } from "@/components/keyword-links"
import { LoanDetails } from "@/components/loan-details"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"
import type { Lang } from "@/lib/translations"

export function LandingPage({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <SiteHeader />
      <main>
        <Hero />
        <PrestamoLibreSection />
        <AppHighlights />
        <HowItWorks />
        <LoanDetails />
        {/* <KeywordLinks /> */}
        <FinalCta />
      </main>
      <SiteFooter />
    </LangProvider>
  )
}
