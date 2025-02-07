import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { sanityClient } from '../../../sanity-client'

const ARTIST_QUERY = `
  *[_type == "artist" && slug.current == $slug] {
    name
  }[0]
`

interface Props {
  params: Promise<{
    slug: string
  }>
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { slug } = await params

  const artist = await firstValueFrom(
    sanityClient.fetch(ARTIST_QUERY, {
      slug,
    }),
  )

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
