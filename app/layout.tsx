import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://grigri.exkson.tech"),
  title: {
    default: "Grigri — Immobilier France",
    template: "%s | Grigri",
  },
  description:
    "Grigri est une plateforme immobilière interactive qui permet d'explorer les villes françaises, leurs statistiques et les logements disponibles sur une carte interactive.",
  keywords: [
    "immobilier France",
    "logement",
    "prix immobilier",
    "carte interactive",
    "appartement",
    "maison",
    "investissement immobilier",
    "real estate",
  ],
  authors: [{ name: "Grigri", url: "https://grigri.exkson.tech" }],
  creator: "Grigri",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://grigri.exkson.tech",
    siteName: "Grigri",
    title: "Grigri — Immobilier France",
    description:
      "Explorez les villes françaises et découvrez les logements disponibles, les prix au m² et les statistiques immobilières sur une carte interactive.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grigri — Immobilier France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grigri — Immobilier France",
    description:
      "Explorez les villes françaises et découvrez les logements disponibles, les prix au m² et les statistiques immobilières.",
    images: ["/og-image.png"],
    creator: "@grigri_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={outfit.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
