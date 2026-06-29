"use client"

import { PLAY_STORE_URL } from "@/lib/translations"

export function GooglePlayButton({
  label,
  meta,
  className = "",
  size = "md",
}: {
  label: string
  meta?: string
  className?: string
  size?: "sm" | "md"
}) {
  const sizes =
    size === "sm"
      ? {
          wrapper: "px-4 py-2 text-sm",
          icon: "size-8",
          svg: "size-4.5",
          meta: "text-[9px]",
          label: "text-xs",
        }
      : {
          wrapper: "px-6 py-3 text-base",
          icon: "size-10",
          svg: "size-5",
          meta: "text-[10px]",
          label: "text-sm",
        }

  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-full bg-[#4F6EF7] ${sizes.wrapper} font-semibold text-white shadow-lg shadow-[#4F6EF7]/25 transition-transform hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4F6EF7]/25 ${className}`}
    >
      <span
        className={`inline-flex ${sizes.icon} items-center justify-center rounded-full bg-white shadow-sm`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 512 512" className={sizes.svg}>
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
      <span className="flex flex-col text-left leading-none">
        {meta ? <span className={`${sizes.meta} opacity-80`}>{meta}</span> : null}
        <span className={`${sizes.label} font-semibold`}>{label}</span>
      </span>
    </a>
  )
}
