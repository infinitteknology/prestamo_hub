"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, List, Tag } from "lucide-react"
import { GooglePlayButton } from "@/components/google-play-button"
import { useLang } from "@/components/lang-provider"

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
}

export function PrivacySection() {
  const { t, lang } = useLang()

  const content = {
    en: {
      title: "Privacy Policy",
      intro: {
        title: "Introduction",
        text: "Préstamo Hub is a loan comparison and financial information platform operated by Legalflow, S.A. de C.V., a Mexican technology company. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.",
      },
      informationWeCollect: {
        title: "Information We Collect",
        items: [
          "IP address",
          "Cookies and similar tracking technologies",
          "Browser and device information (e.g., user agent, screen resolution)",
          "Usage behavior (pages visited, clicks, time spent on site)",
          "Referral and affiliate tracking data",
        ],
      },
      howWeUse: {
        title: "How We Use Information",
        items: [
          "Service improvement and optimization",
          "Loan comparison functionality",
          "Analytics and performance measurement",
          "Affiliate tracking and attribution",
        ],
      },
      cookies: {
        title: "Cookies Policy",
        text: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand how you interact with our website. You can control cookie preferences through your browser settings.",
      },
      thirdParty: {
        title: "Third-Party Sharing",
        text: "We may share your information with the following categories of third parties:",
        items: [
          "Lenders and financial institutions for loan comparison purposes",
          "Analytics providers (e.g., Google Analytics) to understand site usage",
          "Affiliate partners for attribution and commission tracking",
        ],
        noSell: "We do NOT sell your personal information to any third parties.",
      },
      dataRights: {
        title: "Your Data Rights",
        items: [
          "Access to your personal information",
          "Request deletion of your personal information",
          "Opt-out of certain data collection practices",
        ],
      },
      dataRetention: {
        title: "Data Retention",
        text: "We retain your information only as long as necessary to provide our services and comply with legal obligations. When information is no longer needed, we securely delete or anonymize it.",
      },
      security: {
        title: "Security Measures",
        text: "We implement appropriate technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. This includes encryption, access controls, and regular security reviews.",
      },
      legalEntity: {
        title: "Legal Entity",
        text: "Legalflow, S.A. de C.V.",
      },
      contact: {
        title: "Contact Us",
        text: "For any questions about this Privacy Policy or your data rights, please contact us at:",
        email: "support@prestamohub.com",
      },
      disclaimer: {
        title: "Disclaimer",
        text: "Préstamo Hub is not a lender and does not make credit decisions. We provide information and comparison tools to help you explore loan options, but we do not guarantee approval or any specific loan terms.",
      },
    },
    es: {
      title: "Política de Privacidad",
      intro: {
        title: "Introducción",
        text: "Préstamo Hub es una plataforma de comparación e información financiera operada por Legalflow, S.A. de C.V., una empresa de tecnología mexicana. Respetamos tu privacidad y nos comprometemos a proteger tu información personal. Esta Política de Privacidad explica cómo recopilamos, usamos y resguardamos tu información cuando utilizas nuestro sitio web y servicios.",
      },
      informationWeCollect: {
        title: "Información que Recopilamos",
        items: [
          "Dirección IP",
          "Cookies y tecnologías de seguimiento similares",
          "Información del navegador y dispositivo (ej: user agent, resolución de pantalla)",
          "Comportamiento de uso (páginas visitadas, clics, tiempo en el sitio)",
          "Datos de seguimiento de referidos y afiliados",
        ],
      },
      howWeUse: {
        title: "Cómo Usamos la Información",
        items: [
          "Mejora y optimización del servicio",
          "Funcionalidad de comparación de préstamos",
          "Analíticas y medición de rendimiento",
          "Seguimiento y atribución de afiliados",
        ],
      },
      cookies: {
        title: "Política de Cookies",
        text: "Utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación, analizar el tráfico del sitio y entender cómo interactúas con nuestro sitio web. Puedes controlar las preferencias de cookies a través de la configuración de tu navegador.",
      },
      thirdParty: {
        title: "Compartir con Terceros",
        text: "Podemos compartir tu información con las siguientes categorías de terceros:",
        items: [
          "Prestamistas e instituciones financieras para fines de comparación de préstamos",
          "Proveedores de analíticas (ej: Google Analytics) para entender el uso del sitio",
          "Socios afiliados para seguimiento de atribución y comisiones",
        ],
        noSell: "NO vendemos tu información personal a ningún tercero.",
      },
      dataRights: {
        title: "Tus Derechos de Datos",
        items: [
          "Acceder a tu información personal",
          "Solicitar la eliminación de tu información personal",
          "Optar por no participar en ciertas prácticas de recopilación de datos",
        ],
      },
      dataRetention: {
        title: "Retención de Datos",
        text: "Retenemos tu información solo mientras sea necesario para proporcionar nuestros servicios y cumplir con obligaciones legales. Cuando la información ya no sea necesaria, la eliminamos o anonimizamos de forma segura.",
      },
      security: {
        title: "Medidas de Seguridad",
        text: "Implementamos medidas técnicas y organizativas apropiadas para proteger tu información contra acceso no autorizado, divulgación, alteración o destrucción. Esto incluye cifrado, controles de acceso y revisiones de seguridad periódicas.",
      },
      legalEntity: {
        title: "Entidad Legal",
        text: "Legalflow, S.A. de C.V.",
      },
      contact: {
        title: "Contáctanos",
        text: "Para cualquier pregunta sobre esta Política de Privacidad o tus derechos de datos, por favor contáctanos en:",
        email: "support@prestamohub.com",
      },
      disclaimer: {
        title: "Descargo de Responsabilidad",
        text: "Préstamo Hub no es un prestamista y no toma decisiones de crédito. Proporcionamos información y herramientas de comparación para ayudarte a explorar opciones de préstamos, pero no garantizamos la aprobación ni términos específicos de préstamo.",
      },
    },
  }

  const c = content[lang]
  const lastUpdatedDate = new Date().toLocaleDateString(
    lang === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  )

  const headingItems = useMemo(() => {
    const sectionKeys = Object.keys(c).filter(key => key !== 'title')
    return sectionKeys.map(key => {
      const section = c[key as keyof typeof c]
      if (section && typeof section === 'object' && 'title' in section) {
        return {
          id: slugify(section.title),
          text: section.title,
        }
      }
      return null
    }).filter((item): item is NonNullable<typeof item> => item !== null)
  }, [c])

  const [activeHeadingId, setActiveHeadingId] = useState("")
  const [pinUntil, setPinUntil] = useState(0)

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveHeadingId(id)
    setPinUntil(Date.now() + 900)
    history.replaceState(null, "", `#${id}`)
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    if (headingItems.length === 0) return

    const elements = headingItems
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < pinUntil) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0)
          )
        const next = visible[0]?.target?.id
        if (next) setActiveHeadingId(next)
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.1, 0.2, 0.3],
      }
    )

    for (const el of elements) observer.observe(el)

    return () => observer.disconnect()
  }, [headingItems, pinUntil])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) setActiveHeadingId(hash)
    }
    onHashChange()
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const contentTitle = lang === "es" ? "Contenido" : "Contents"
  const updatedLabel = lang === "es" ? "Última actualización" : "Last updated"
  const keywords = lang === "es"
    ? ["política de privacidad", "préstamos en méxico", "legalflow", "seguridad de datos"]
    : ["privacy policy", "loans in mexico", "legalflow", "data security"]

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground">
          {t.nav.home}
        </Link>
        <span>/</span>
        <span className="text-foreground">{c.title}</span>
      </nav>

      <header className="mt-6">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {c.title}
        </h1>
        <div className="mt-4 rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(125,167,255,0.12),rgba(125,167,255,0.03))] px-5 py-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>
              {updatedLabel} <span className="font-semibold text-foreground">{lastUpdatedDate}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <List className="size-4 text-primary" />
              <span>{contentTitle}</span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {headingItems.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToHeading(heading.id)
                  }}
                  className={`rounded-md px-2 py-1 text-sm leading-relaxed transition-colors ${
                    activeHeadingId === heading.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-col gap-6 leading-relaxed">
            <Section title={c.intro.title} id={headingItems[0]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.intro.text}</p>
            </Section>

            <Section title={c.informationWeCollect.title} id={headingItems[1]?.id}>
              <ul className="mt-3 flex flex-col gap-2 pl-1">
                {c.informationWeCollect.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-base leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={c.howWeUse.title} id={headingItems[2]?.id}>
              <ul className="mt-3 flex flex-col gap-2 pl-1">
                {c.howWeUse.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-base leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={c.cookies.title} id={headingItems[3]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.cookies.text}</p>
            </Section>

            <Section title={c.thirdParty.title} id={headingItems[4]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.thirdParty.text}</p>
              <ul className="mt-3 flex flex-col gap-2 pl-1">
                {c.thirdParty.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-base leading-7">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl border border-[#2ecc71]/25 bg-[linear-gradient(180deg,rgba(46,204,113,0.14),rgba(46,204,113,0.05))] p-5 md:p-6">
                <p className="text-base font-semibold leading-7 text-foreground">
                  {c.thirdParty.noSell}
                </p>
              </div>
            </Section>

            <Section title={c.dataRights.title} id={headingItems[5]?.id}>
              <ul className="mt-3 flex flex-col gap-2 pl-1">
                {c.dataRights.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-base leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={c.dataRetention.title} id={headingItems[6]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.dataRetention.text}</p>
            </Section>

            <Section title={c.security.title} id={headingItems[7]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.security.text}</p>
            </Section>

            <Section title={c.legalEntity.title} id={headingItems[8]?.id}>
              <div className="mt-3 rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-base font-semibold leading-7 text-foreground">
                  {c.legalEntity.text}
                </p>
              </div>
            </Section>

            <Section title={c.contact.title} id={headingItems[9]?.id}>
              <p className="text-base leading-7 text-muted-foreground">{c.contact.text}</p>
              <a
                href={`mailto:${c.contact.email}`}
                className="mt-3 inline-flex text-base font-semibold text-primary hover:underline"
              >
                {c.contact.email}
              </a>
            </Section>

            <Section title={c.disclaimer.title} id={headingItems[10]?.id}>
              <div className="mt-3 rounded-2xl border border-border bg-card p-5">
                <p className="text-base leading-7 text-muted-foreground">{c.disclaimer.text}</p>
              </div>
            </Section>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="size-4 text-primary" />
              <span>{lang === "es" ? "Palabras clave" : "Keywords"}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(46,204,113,0.12),rgba(46,204,113,0.04))] p-8 text-center md:p-10">
            <h2 className="text-balance text-xl font-bold tracking-tight">
              {t.blog.ctaTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.blog.ctaSubtitle}
            </p>
            <GooglePlayButton
              label={t.cta.button}
              className="mt-5 inline-flex"
            />
          </div>

          <div className="mt-10">
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <ArrowLeft className="size-4" />
              {lang === "es" ? "Volver al inicio" : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">
        {title}
      </h2>
      {children}
    </div>
  )
}
