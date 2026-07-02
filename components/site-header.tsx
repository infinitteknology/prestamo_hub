"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { GooglePlayButton } from "@/components/google-play-button"
import { useLang } from "@/components/lang-provider"

function LangToggle() {
  const { lang } = useLang()
  const pathname = usePathname()

  const getLangHref = (targetLang: "es" | "en") => {
    const normalized = pathname || "/es"
    const switched = normalized.replace(/^\/(es|en)(?=\/|$)/, `/${targetLang}`)
    return switched === normalized && !/^\/(es|en)(?=\/|$)/.test(normalized)
      ? `/${targetLang}`
      : switched
  }

  return (
    <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 p-0.5 text-xs font-semibold">
      <Link
        href={getLangHref("es")}
        hrefLang="es"
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "es"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
        }`}
        aria-current={lang === "es" ? "true" : undefined}
      >
        ES
      </Link>
      <Link
        href={getLangHref("en")}
        hrefLang="en"
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
        }`}
        aria-current={lang === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  )
}

export function SiteHeader() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const home = `/${lang}`
  const links = useMemo(() => {
    return [
      { id: "home", href: home, label: t.nav.home },
      { id: "calculator", href: `${home}/calculadora-creditos-mexico`, label: t.nav.calculator },
      { id: "faq", href: `${home}/preguntas`, label: t.nav.faq },
      { id: "blog", href: `${home}/blog`, label: t.nav.blog },
      { id: "security", href: `${home}/seguridad`, label: t.nav.security },
      { id: "privacy", href: `${home}/privacidad`, label: t.nav.privacy },
    ] as const
  }, [home, t.nav.blog, t.nav.calculator, t.nav.faq, t.nav.home, t.nav.security, t.nav.privacy])

  const active = useMemo(() => {
    if (!pathname) return ""
    if (pathname === home) return "home"
    if (pathname.startsWith(`${home}/calculadora`)) return "calculator"
    if (pathname.startsWith(`${home}/preguntas`)) return "faq"
    if (pathname.startsWith(`${home}/blog`)) return "blog"
    if (pathname.startsWith(`${home}/seguridad`)) return "security"
    if (pathname.startsWith(`${home}/privacidad`)) return "privacy"
    return ""
  }, [home, pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href={home} className="flex items-center gap-2">
          <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            <Image
              src="/logo360.png"
              alt="Préstamo Hub"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="flex h-8 flex-col justify-between leading-none">
            <span className="text-base font-bold tracking-tight">Préstamo Hub</span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {lang === "es" ? "Crédito Fácil" : "Easy Credit"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                active === link.id
                  ? "rounded-md bg-primary/10 px-2 py-1 text-primary"
                  : "rounded-md px-2 py-1 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <div className="hidden flex-col items-end gap-1 md:flex">
            <GooglePlayButton label={t.nav.download} size="sm" />
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                  active === link.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <GooglePlayButton
              label={t.nav.download}
              size="sm"
              className="mt-2 w-full justify-center"
            />
          </nav>
        </div>
      )}
    </header>
  )
}
