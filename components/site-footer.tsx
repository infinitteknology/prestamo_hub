"use client"

import Image from "next/image"
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import { useLang } from "@/components/lang-provider"
import { PLAY_STORE_URL } from "@/lib/translations"

export function SiteFooter() {
  const { t, lang } = useLang()
  const contactItems = [
    {
      icon: Mail,
      content: "support@prestamohub.com",
      href: "mailto:support@prestamohub.com",
    },
    {
      icon: Phone,
      content: lang === "es" ? "Atencion por correo y app" : "Support via email and app",
    },
    {
      icon: Clock3,
      content: lang === "es" ? "Lunes a Domingo" : "Monday to Sunday",
    },
    {
      icon: MapPin,
      content: "215 Calle Yacatas, Ciudad de Mexico 03020",
    },
  ]

  return (
    <footer className="overflow-hidden bg-[#071226] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                <Image
                  src="/logo360.png"
                  alt="Prestamo Hub"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </span>
              <div>
                <p className="text-xl font-bold tracking-tight">Prestamo Hub</p>
                <p className="text-sm text-white/70">
                  {lang === "es"
                    ? "Tu confianza, nuestra prioridad"
                    : "Your trust, our priority"}
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/70">
              {t.footer.tagline}
            </p>

            <p className="max-w-md text-sm leading-7 text-white/55">
              {t.footer.disclaimer}
            </p>

            <div>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#071226] transition-colors hover:bg-white/90"
              >
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#e8eefc]">
                  <svg viewBox="0 0 512 512" className="size-3.5">
                    <path
                      fill="#00D2FF"
                      d="M47 27.6C42 31.1 39 38 39 47.2v417.6c0 9.2 3 16.1 8 19.6l1.7 1L286 256.2v-.4-.4L48.7 26.6 47 27.6z"
                    />
                    <path
                      fill="#FFD500"
                      d="M362 333.5l-76-76v-.4-.4l76-76 1.7 1 90 51.1c25.7 14.6 25.7 38.5 0 53.1l-90 51.1-1.7.8z"
                    />
                    <path
                      fill="#FF3A44"
                      d="M363.7 332.7L286 256 47 484.4c8.5 9 22.4 10.1 38.1 1.1l278.6-152.8"
                    />
                    <path
                      fill="#00F076"
                      d="M363.7 179.3L85.1 26.6C69.4 17.5 55.5 18.6 47 27.6L286 256l77.7-76.7z"
                    />
                  </svg>
                </span>
                Google Play
              </a>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold">
              {lang === "es" ? "Contactanos" : "Contact us"}
            </p>
            <p className="mt-5 text-sm font-medium text-white/80">
              {t.footer.contact}
            </p>

            <div className="mt-5 space-y-4 text-sm text-white/70">
              {contactItems.map((item) => {
                const Icon = item.icon
                const content = (
                  <>
                    <Icon className="mt-0.5 size-4 shrink-0 text-white/55" />
                    <span className="leading-6">{item.content}</span>
                  </>
                )

                return item.href ? (
                  <a
                    key={item.content}
                    href={item.href}
                    className="inline-flex items-start gap-3 transition-colors hover:text-white"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.content} className="flex items-start gap-3">
                    {content}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/65">
              <p className="font-semibold text-white/90">Legalflow, S.A. de C.V.</p>
              <p className="mt-2 leading-6">
                {lang === "es"
                  ? "Plataforma de comparacion e informacion financiera para usuarios en Mexico."
                  : "Comparison and financial information platform for users in Mexico."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-[#050d1c]">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/45 md:px-6">
          © {new Date().getFullYear()} Legalflow, S.A. de C.V. {t.footer.rights}
        </div>
      </div>
    </footer>
  )
}
