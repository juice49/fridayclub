'use cache'

import type { ComponentType } from 'react'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { slug } = await params
  return (
    <>
      <h1>track: {slug}</h1>
    </>
  )
}

export default Page
