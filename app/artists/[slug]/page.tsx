import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { sanityClient } from '../../../sanity-client'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtist(slug)

  return {
    title: artist.name,
  }
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { slug } = await params
  const artist = await getArtist(slug)

  if (artist === null) {
    return notFound()
  }

  return (
    <>
      <h1>{artist.name}</h1>
    </>
  )
}

export default Page

const ARTIST_QUERY = `
  *[_type == "artist" && slug.current == $slug] {
    name
  }[0]
`

async function getArtist(slug: string) {
  'use cache'
  return await firstValueFrom(
    sanityClient.fetch(ARTIST_QUERY, {
      slug,
    }),
  )
}
