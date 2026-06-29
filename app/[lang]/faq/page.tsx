import { notFound, redirect } from "next/navigation"

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") notFound()
  redirect(`/${lang}/preguntas`)
}
