import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog"
import { seoPages } from "@/lib/seo-pages"

const SITE_URL = "https://prestamohub.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const langLinks = (path: string) => ({
    languages: {
      "es-MX": `${SITE_URL}/es${path}`,
      en: `${SITE_URL}/en${path}`,
    },
  })

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/es`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: langLinks(""),
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: langLinks(""),
    },
    {
      url: `${SITE_URL}/es/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: langLinks("/blog"),
    },
    {
      url: `${SITE_URL}/en/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: langLinks("/blog"),
    },
    {
      url: `${SITE_URL}/es/calculadora`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: langLinks("/calculadora"),
    },
    {
      url: `${SITE_URL}/en/calculadora`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: langLinks("/calculadora"),
    },
    {
      url: `${SITE_URL}/es/preguntas`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: langLinks("/preguntas"),
    },
    {
      url: `${SITE_URL}/en/preguntas`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.65,
      alternates: langLinks("/preguntas"),
    },
    {
      url: `${SITE_URL}/es/seguridad`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: langLinks("/seguridad"),
    },
    {
      url: `${SITE_URL}/en/seguridad`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.65,
      alternates: langLinks("/seguridad"),
    },
  ]

  for (const post of blogPosts) {
    const path = `/blog/${post.slug}`
    entries.push(
      {
        url: `${SITE_URL}/es${path}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: langLinks(path),
      },
      {
        url: `${SITE_URL}/en${path}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: langLinks(path),
      },
    )
  }

  for (const page of seoPages) {
    const path = `/${page.slug}`
    entries.push(
      {
        url: `${SITE_URL}/es${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
        alternates: langLinks(path),
      },
      {
        url: `${SITE_URL}/en${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.75,
        alternates: langLinks(path),
      },
    )
  }

  entries.push(
    {
      url: `${SITE_URL}/es/prestamo-libre`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: langLinks("/prestamo-libre"),
    },
    {
      url: `${SITE_URL}/en/prestamo-libre`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: langLinks("/prestamo-libre"),
    },
  )

  return entries
}
