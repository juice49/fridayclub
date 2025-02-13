import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { sanityClient } from '../../../sanity-client'

const listFormat = new Intl.ListFormat('en')

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const track = await getTrack(slug)

  return {
    title: `${track.title} by ${listFormat.format(track.artists.map(({ name }) => name))}`,
  }
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { slug } = await params
  const track = await getTrack(slug)

  if (track === null) {
    return notFound()
  }

  const artistsBySlug = Object.fromEntries(
    track.artists.map(artist => [artist.slug.current, artist]),
  )

  return (
    <>
      <h1>{track.title}</h1>
      <p>
        By{' '}
        {listFormat
          .formatToParts(Object.keys(artistsBySlug))
          .map(({ type, value }) => {
            if (type === 'literal') {
              return value
            }

            const artist = artistsBySlug[value]

            return (
              <Link key={value} href={`/artists/${artist.slug.current}`}>
                {artist.name}
              </Link>
            )
          })}
      </p>
      {track.sources.youtube && (
        <iframe
          title='video'
          width='640'
          height='360'
          src={`https://www.youtube.com/embed/${track.sources.youtube}`}
          frameBorder='0'
          seamless
        />
      )}
    </>
  )
}

export default Page

const TRACK_QUERY = `
  *[_type == "track" && slug.current == $slug] {
    title,
    "artists": artists[]->{
      name,
      slug
    },
    sources
  }[0]
`

async function getTrack(slug: string) {
  return await firstValueFrom(
    sanityClient.fetch(TRACK_QUERY, {
      slug,
    }),
  )
}
