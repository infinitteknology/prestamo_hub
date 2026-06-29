import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://prestamohub.com'),
  title: {
    default: 'Préstamo Hub: Compara préstamos y crédito fácil en México',
    template: '%s | Préstamo Hub',
  },
  description:
    'Compara préstamos de múltiples prestamistas en México. Montos de MXN 600 a 60,000, plazos de 61 a 365 días. Calcula tus pagos y solicita 100% en línea. Compare loans in Mexico — free, fast and digital.',
  keywords: [
    'préstamos en línea',
    'comparar préstamos',
    'crédito fácil',
    'préstamos México',
    'calculadora de préstamos',
    'préstamos personales',
    'online loans Mexico',
    'loan comparison',
    'Préstamo Hub',
  ],
  applicationName: 'Préstamo Hub',
  authors: [{ name: 'Legalflow, S.A. de C.V.' }],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    alternateLocale: 'en_US',
    siteName: 'Préstamo Hub',
    title: 'Préstamo Hub: Compara préstamos y crédito fácil en México',
    description:
      'Compara opciones de préstamo de múltiples proveedores, calcula tus pagos y solicita 100% en línea desde tu celular.',
    images: [{ url: '/first.png', width: 640, height: 800, alt: 'Préstamo Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Préstamo Hub: Compara préstamos en México',
    description:
      'Compara préstamos de múltiples prestamistas, calcula tus pagos y solicita en línea.',
    images: ['/first.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        type: 'image/png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MobileApplication',
              name: 'Préstamo Hub: Crédito Fácil',
              operatingSystem: 'ANDROID',
              applicationCategory: 'FinanceApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN' },
              description:
                'Plataforma de comparación de préstamos e información financiera en México.',
              installUrl:
                'https://play.google.com/store/apps/details?id=com.appup.prestamohub',
              author: { '@type': 'Organization', name: 'Legalflow, S.A. de C.V.' },
            }),
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
