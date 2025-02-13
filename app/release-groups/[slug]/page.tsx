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
  const releaseGroup = await getReleaseGroup(slug)

  return {
    title: releaseGroup.name,
  }
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { slug } = await params
  const releaseGroup = await getReleaseGroup(slug)

  if (releaseGroup === null) {
    return notFound()
  }

  return (
    <>
      <h1>{releaseGroup.name}</h1>
    </>
  )
}

export default Page

const RELEASE_GROUP_QUERY = `
  *[_type == "releaseGroup" && slug.current == $slug] {
    name
  }[0]
`

async function getReleaseGroup(slug: string) {
  'use cache'
  return await firstValueFrom(
    sanityClient.fetch(RELEASE_GROUP_QUERY, {
      slug,
    }),
  )
}
