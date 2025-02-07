import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { sanityClient } from '../../../sanity-client'

const RELEASE_GROUP_QUERY = `
  *[_type == "releaseGroup" && slug.current == $slug] {
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

  const releaseGroup = await firstValueFrom(
    sanityClient.fetch(RELEASE_GROUP_QUERY, {
      slug,
    }),
  )

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
