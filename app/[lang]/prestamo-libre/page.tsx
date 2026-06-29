import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GooglePlayButton } from "@/components/google-play-button"
import type { Lang } from "@/lib/translations"

const SITE_URL = "https://prestamohub.com"

const content: Record<
  Lang,
  {
    title: string
    description: string
    kicker: string
    headingLeft: string
    headingRight: string
    body: string
    points: Array<{ title: string; subtitle: string }>
    cta: string
  }
> = {
  es: {
    title: "Préstamo libre, todo bajo control | Préstamo Hub",
    description:
      "Conoce cómo comparar opciones de préstamo, elegir monto y plazo, y planificar pagos desde una experiencia 100% digital.",
    kicker: "Múltiples opciones de préstamo",
    headingLeft: "Préstamo libre, todo bajo control",
    headingRight:
      "Te ofrecemos múltiples opciones de préstamo para que elijas libremente el monto, el plazo y la forma de pago según tu planificación. Disfruta pagos flexibles y sin presión.",
    body: "Explora opciones, estima pagos y revisa detalles clave antes de continuar con un proveedor. Préstamo Hub es una plataforma de comparación e información financiera; no otorga préstamos directamente.",
    points: [
      { title: "Monto", subtitle: "Elige el monto que necesitas." },
      { title: "Plazo", subtitle: "Selecciona el plazo que prefieras." },
      { title: "Forma de pago", subtitle: "Elige la forma de pago que mejor se adapte." },
    ],
    cta: "Descargar App",
  },
  en: {
    title: "Flexible loans, everything under control | Préstamo Hub",
    description:
      "Learn how to compare loan options, choose amount and term, and plan repayments in a 100% digital experience.",
    kicker: "Multiple loan options",
    headingLeft: "Flexible loans, everything under control",
    headingRight:
      "We offer multiple loan options so you can freely choose the amount, term and repayment method based on your plan. Enjoy flexible repayments with less pressure.",
    body: "Compare options, estimate payments and review key details before continuing with a provider. Préstamo Hub is a comparison and financial information platform; it does not issue loans directly.",
    points: [
      { title: "Amount", subtitle: "Choose the amount you need." },
      { title: "Term", subtitle: "Pick the term you prefer." },
      { title: "Repayment method", subtitle: "Choose the repayment method that fits you." },
    ],
    cta: "Download App",
  },
}

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") return {}
  const l = lang as Lang
  const c = content[l]

  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `${SITE_URL}/${l}/prestamo-libre`,
      languages: {
        "es-MX": `${SITE_URL}/es/prestamo-libre`,
        en: `${SITE_URL}/en/prestamo-libre`,
        "x-default": `${SITE_URL}/es/prestamo-libre`,
      },
    },
    openGraph: {
      type: "website",
      locale: l === "es" ? "es_MX" : "en_US",
      url: `${SITE_URL}/${l}/prestamo-libre`,
      siteName: "Préstamo Hub",
      title: c.title,
      description: c.description,
      images: [{ url: "/index.png", width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: ["/index.png"],
    },
  }
}

export default async function PrestamoLibrePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") notFound()
  const l = lang as Lang
  const c = content[l]

  return (
    <LangProvider lang={l}>
      <SiteHeader />
      <main>
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 md:grid-cols-2 md:px-6">
            <div className="order-2 md:order-1">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <Image
                  src="/index.png"
                  alt={c.title}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                {c.kicker}
              </span>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                {c.headingLeft}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {c.headingRight}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {c.points.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {p.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {p.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>

              <div className="mt-8">
                <GooglePlayButton label={c.cta} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </LangProvider>
  )
}
