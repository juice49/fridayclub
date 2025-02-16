'use cache'

import { PortableText } from '@portabletext/react'
import { Image } from '@unpic/react/nextjs'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { Sources } from '../components/sources'
import { LEGACY_ARTICLE_DATE, LOCALE, TIMEZONE } from '../constants'
import { LIST_ARTICLES_QUERY } from '../queries/articles'
import { sanityClient } from '../sanity-client'

const listFormatter = new Intl.ListFormat('en')

const components = {
  types: {
    item: ({ value }) => (
      <div>
        <div style={{ padding: '2rem', outline: '1px dashed currentColor' }}>
          {value.subject.map(subject => (
            <article
              key={subject._id}
              style={{
                display: 'flex',
                gap: '1rem',
              }}
            >
              {subject.releaseGroup?.coverArt && (
                <Image
                  src={subject.releaseGroup.coverArt.asset.url}
                  width={80}
                  alt={`Cover art for "${subject.releaseGroup.name}"`}
                  aspectRatio={subject.releaseGroup.coverArt.asset.aspectRatio}
                />
              )}
              <div>
                <h3>
                  <strong style={{ textTransform: 'uppercase' }}>
                    {subject.title}
                  </strong>{' '}
                  by {listFormatter.format(subject.artistsNames)}
                </h3>
                <Sources sources={subject.sources} />
              </div>
            </article>
          ))}
        </div>
        {/* @ts-ignore */}
        <PortableText value={value.body} components={components} />
      </div>
    ),
    lyrics: ({ value }) => (
      <div>
        <div
          style={{
            fontVariationSettings: `"slnt" -6, "wdth" 125, "wght" 800`,
            fontSize: '4rem',
            lineHeight: 1,
            textTransform: 'uppercase',
            color: 'oklch(56.18% 0.2319 288)',
          }}
        >
          {/* @ts-ignore */}
          <PortableText value={value.lyrics} components={components} />
        </div>
        <p
          style={{
            marginBlockStart: 0,
            textAlign: 'right',
            fontStyle: 'italic',
          }}
        >
          <strong
            style={{
              textTransform: 'uppercase',
              fontVariationSettings: `"slnt" -6, "wdth" 125, "wght" 800`,
            }}
          >
            {value.trackTitle}
          </strong>{' '}
          by {listFormatter.format(value.trackArtistsNames)}
        </p>
        <Sources sources={value.sources} />
        {/* @ts-ignore */}
        <PortableText value={value.comment} components={components} />
      </div>
    ),
  },
  marks: {
    internalLink: ({ value, children }) => (
      <Link href={value.path}>{children}</Link>
    ),
  },
}

const Page: ComponentType = async () => {
  const articles = await firstValueFrom(sanityClient.fetch(LIST_ARTICLES_QUERY))

  return (
    <>
      <h1>fridayclub</h1>
      {articles.map(article => (
        <article
          key={article._id}
          style={{ maxWidth: '60ch', marginInline: 'auto' }}
        >
          <h2>{article.title}</h2>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}{' '}
            {isDay(article.publishedAt, 'Friday')
              ? '(friday!)'
              : '(not a friday)'}
          </time>
          {article.publishedAt < LEGACY_ARTICLE_DATE && (
            <p>
              <em>
                I started writing this post while I was still putting the site
                together, so its publication is a little delayed.
              </em>
            </p>
          )}
          {/* @ts-ignore */}
          <PortableText value={article.body} components={components} />
        </article>
      ))}
    </>
  )
}

export default Page

function isDay(date: string, dayName: string): boolean {
  return (
    new Date(date).toLocaleString(LOCALE, {
      timeZone: TIMEZONE,
      weekday: 'long',
    }) === dayName
  )
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    dateStyle: 'long',
  }).format(new Date(date))
}
