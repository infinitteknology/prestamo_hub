"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { useLang } from "@/components/lang-provider"
import { PLAY_STORE_URL } from "@/lib/translations"

const icons = [ShieldCheck, LockKeyhole, Smartphone, CheckCircle2]

export function SecuritySection() {
  const { t, lang } = useLang()
  const transparencyTitle =
    lang === "es"
      ? "Transparencia y prevencion de fraude"
      : "Transparency and fraud prevention"
  const transparencyBody =
    lang === "es"
      ? "Mostramos practicas de privacidad y seguridad con base en informacion publica y verificable. Antes de continuar con cualquier proveedor, revisa costos, condiciones y los canales oficiales de contacto."
      : "We show privacy and security practices based on public and verifiable information. Before continuing with any provider, review costs, terms and the official contact channels."
  const fraudTitle =
    lang === "es"
      ? "Que hacer si detectas un intento de fraude"
      : "What to do if you detect a fraud attempt"
  const fraudBody =
    lang === "es"
      ? "Verifica siempre que la informacion provenga de canales oficiales. No compartas datos sensibles fuera de la app o de sitios identificables del proveedor."
      : "Always verify that information comes from official channels. Do not share sensitive data outside the app or outside identifiable provider websites."
  const officialTitle =
    lang === "es" ? "Canales oficiales" : "Official channels"
  const docsTitle =
    lang === "es" ? "Informacion y ayuda" : "Information and help"
  const faqLabel =
    lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"
  const homeLabel = lang === "es" ? "Volver al inicio" : "Back to home"
  const playLabel =
    lang === "es" ? "Ver en Google Play" : "View on Google Play"
  const contactNote =
    lang === "es"
      ? "Atencion por correo y app"
      : "Support via email and app"
  const hours =
    lang === "es" ? "Lunes a Domingo" : "Monday to Sunday"

  return (
    <section id="security" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <article className="overflow-hidden rounded-[2rem] border border-border">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="px-6 py-10 md:px-10 md:py-12">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {t.security.kicker}
                </p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
                  {t.security.title}
                </h2>
                <p className="mt-5 max-w-2xl text-pretty leading-8 text-muted-foreground">
                  {t.security.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
                    {lang === "es" ? "Costos claros" : "Clear costs"}
                  </span>
                  <span className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
                    {lang === "es" ? "Privacidad visible" : "Visible privacy"}
                  </span>
                  <span className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
                    {lang === "es" ? "Verificacion oficial" : "Official verification"}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-8 pt-0 md:px-10 md:pb-10 lg:py-10">
                <div className="flex min-h-[280px] items-center justify-center rounded-[2rem] bg-secondary/40 p-6 md:min-h-[360px] md:p-8">
                  <div className="relative flex h-56 w-full max-w-md items-center justify-center md:h-72">
                    <div className="absolute inset-x-6 top-1/2 h-28 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/20 md:inset-x-0 md:h-40" />
                    <div className="absolute left-4 top-10 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:left-10 md:top-16">
                      <LockKeyhole className="size-6" />
                    </div>
                    <div className="absolute right-4 top-10 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:right-10 md:top-16">
                      <Fingerprint className="size-6" />
                    </div>
                    <div className="absolute bottom-8 left-10 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:bottom-12 md:left-20">
                      <BadgeCheck className="size-6" />
                    </div>
                    <div className="absolute bottom-8 right-10 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:bottom-12 md:right-20">
                      <Smartphone className="size-6" />
                    </div>
                    <div className="relative z-10 flex size-32 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_20px_60px_rgba(78,112,248,0.28)] md:size-40">
                      <ShieldCheck className="size-14 md:size-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {t.security.items.map((item, index) => {
            const Icon = icons[index] ?? ShieldCheck
            const textFirst = index % 2 === 0

            return (
              <article
                key={item.title}
                className="overflow-hidden rounded-[2rem] border border-border bg-card"
              >
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
                  <div
                    className={`px-6 py-10 md:px-10 md:py-12 ${
                      textFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      {transparencyTitle}
                    </p>
                    <h3 className="mt-3 max-w-xl text-balance text-2xl font-bold tracking-tight md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-8 text-muted-foreground md:text-base">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`px-6 pb-8 pt-0 md:px-10 md:pb-10 lg:py-10 ${
                      textFirst ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="flex min-h-[240px] items-center justify-center rounded-[2rem] bg-secondary/30 p-6 md:min-h-[320px] md:p-8">
                      {index === 0 ? (
                        <div className="relative w-full max-w-sm">
                          <div className="absolute inset-x-6 top-1/2 h-24 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/15 md:inset-x-2 md:h-32" />
                          <div className="absolute left-2 top-6 flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:left-6 md:top-8">
                            <LockKeyhole className="size-5" />
                          </div>
                          <div className="absolute right-2 bottom-6 flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm md:right-6 md:bottom-8">
                            <Fingerprint className="size-5" />
                          </div>
                          <div className="relative z-10 mx-auto flex size-24 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(78,112,248,0.24)] md:size-28">
                            <ShieldCheck className="size-10 md:size-12" />
                          </div>
                          <div className="mt-6 flex items-center justify-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary/30" />
                            <span className="h-2.5 w-2.5 rounded-full bg-primary/45" />
                            <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                          </div>
                        </div>
                      ) : null}

                      {index === 1 ? (
                        <div className="grid w-full max-w-sm gap-4">
                          <div className="ml-auto flex w-44 items-center gap-3 rounded-[1.5rem] bg-white px-4 py-4 shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <LockKeyhole className="size-5" />
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {lang === "es" ? "Cifrado" : "Encryption"}
                            </div>
                          </div>
                          <div className="mr-auto flex w-48 items-center gap-3 rounded-[1.5rem] bg-primary px-4 py-5 text-primary-foreground shadow-[0_16px_40px_rgba(78,112,248,0.24)]">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                              <BadgeCheck className="size-6" />
                            </div>
                            <div className="text-sm font-semibold">
                              {lang === "es" ? "Verificado" : "Verified"}
                            </div>
                          </div>
                          <div className="ml-10 flex w-40 items-center gap-3 rounded-[1.5rem] bg-white px-4 py-4 shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <FileCheck2 className="size-5" />
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {lang === "es" ? "Revision" : "Review"}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {index === 2 ? (
                        <div className="relative flex w-full max-w-sm items-center justify-center">
                          <div className="absolute left-0 top-8 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                            {lang === "es" ? "Proteccion" : "Protection"}
                          </div>
                          <div className="absolute right-0 top-20 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                            {lang === "es" ? "Privacidad" : "Privacy"}
                          </div>
                          <div className="absolute bottom-8 left-6 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                            {lang === "es" ? "Control" : "Control"}
                          </div>
                          <div className="flex size-28 items-center justify-center rounded-[2.25rem] bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(78,112,248,0.24)] md:size-32">
                            <Smartphone className="size-12 md:size-14" />
                          </div>
                        </div>
                      ) : null}

                      {index === 3 ? (
                        <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2">
                          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                            <CheckCircle2 className="size-6 text-primary" />
                            <p className="mt-3 text-sm font-semibold">
                              {lang === "es" ? "Listo" : "Ready"}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                            <Fingerprint className="size-6 text-primary" />
                            <p className="mt-3 text-sm font-semibold">
                              {lang === "es" ? "Acceso" : "Access"}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                            <BadgeCheck className="size-6 text-primary" />
                            <p className="mt-3 text-sm font-semibold">
                              {lang === "es" ? "Confianza" : "Trust"}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] bg-primary p-5 text-primary-foreground shadow-[0_16px_40px_rgba(78,112,248,0.24)]">
                            <FileCheck2 className="size-6" />
                            <p className="mt-3 text-sm font-semibold">
                              {lang === "es" ? "Claro" : "Clear"}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}

          <article className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
              <div className="px-6 py-10 md:px-10 md:py-12">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <ShieldAlert className="size-5" />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {officialTitle}
                </p>
                <h3 className="mt-3 max-w-xl text-balance text-2xl font-bold tracking-tight md:text-3xl">
                  {fraudTitle}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-8 text-muted-foreground md:text-base">
                  {fraudBody}
                </p>

                <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                  <a
                    href="mailto:support@prestamohub.com"
                    className="flex items-start gap-3 transition-colors hover:text-foreground"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>support@prestamohub.com</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{contactNote}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{hours}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{lang === "es" ? "CDMX, Mexico" : "CDMX, Mexico"}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <span>{playLabel}</span>
                    <ArrowRight className="size-4" />
                  </a>
                  <Link
                    href={`/${lang}/preguntas`}
                    className="inline-flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <span>{faqLabel}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={`/${lang}`}
                    className="inline-flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <span>{homeLabel}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="px-6 pb-8 pt-0 md:px-10 md:pb-10 lg:py-10">
                <div className="flex min-h-[280px] items-center justify-center rounded-[2rem] bg-secondary/30 p-6 md:min-h-[360px] md:p-8">
                  <div className="grid w-full max-w-sm gap-4">
                    <div className="rounded-[1.5rem] border border-border bg-background p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <BadgeCheck className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{docsTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {lang === "es" ? "Canales verificados" : "Verified channels"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <Phone className="size-5 text-primary" />
                        <p className="mt-3 text-sm font-semibold">
                          {lang === "es" ? "Soporte" : "Support"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <Clock3 className="size-5 text-primary" />
                        <p className="mt-3 text-sm font-semibold">
                          {lang === "es" ? "Horario" : "Schedule"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <Mail className="size-5 text-primary" />
                        <p className="mt-3 text-sm font-semibold">
                          {lang === "es" ? "Correo" : "Email"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-background p-4">
                        <MapPin className="size-5 text-primary" />
                        <p className="mt-3 text-sm font-semibold">
                          {lang === "es" ? "Ubicacion" : "Location"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center rounded-[1.5rem] bg-primary p-6 text-primary-foreground shadow-[0_16px_40px_rgba(78,112,248,0.24)]">
                      <ShieldAlert className="size-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
