import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  canonical?: string
  robots?: string
  locale?: string
  alternateLocales?: Array<{ locale: string; url: string }>
  schema?: Record<string, unknown>
}

export function MetaTags({
  title = 'Modern App - 21st.dev Compatible',
  description = 'Aplicação moderna compatível com 21st.dev e Context7 MCP',
  keywords = 'nextjs, react, typescript, tailwindcss, shadcn, 21st.dev',
  ogTitle,
  ogDescription,
  ogImage = '/og-image.jpg',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@21stdev',
  twitterCreator = '@21stdev',
  canonical,
  robots = 'index, follow',
  locale = 'pt-BR',
  alternateLocales = [],
  schema,
}: MetaTagsProps) {
  const finalOgTitle = ogTitle || title
  const finalOgDescription = ogDescription || description
  const finalCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content="21st.dev" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={locale} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl || finalCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Modern App" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Alternate Locales */}
      {alternateLocales.map(({ locale: altLocale, url }) => (
        <link key={altLocale} rel="alternate" hrefLang={altLocale} href={url} />
      ))}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      )}
    </Head>
  )
}

// Page-specific meta tags
export function PageMetaTags({
  title,
  description,
  path,
  ...props
}: Omit<MetaTagsProps, 'canonical' | 'ogUrl'> & {
  path?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
  const canonical = path ? `${baseUrl}${path}` : undefined

  return (
    <MetaTags
      title={title}
      description={description}
      canonical={canonical}
      ogUrl={canonical}
      {...props}
    />
  )
}

// Article meta tags
export function ArticleMetaTags({
  title,
  description,
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  image,
  path,
}: {
  title: string
  description: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
  image?: string
  path?: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
  const canonical = path ? `${baseUrl}${path}` : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? `${baseUrl}${image}` : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: author
      ? {
          '@type': 'Person',
          name: author,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: '21st.dev',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    keywords: tags.join(', '),
  }

  return (
    <MetaTags
      title={title}
      description={description}
      canonical={canonical}
      ogUrl={canonical}
      ogImage={image}
      ogType="article"
      schema={schema}
    />
  )
}
