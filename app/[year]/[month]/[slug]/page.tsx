import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { Article } from '../../../../components/article'
import { ARTICLE_QUERY } from '../../../../queries/articles'
import { sanityClient } from '../../../../sanity-client'

interface Props {
  params: Promise<{
    year: string
    month: string
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month, slug } = await params
  const article = await getArticle({ year, month, slug })

  if (article) {
    return {
      title: article.title,
    }
  }
}

const Page: ComponentType<Props> = async ({ params }) => {
  const { year, month, slug } = await params
  const article = await getArticle({ year, month, slug })

  if (article === null) {
    return notFound()
  }

  return <Article article={article} />
}

export default Page

interface ArticleParams {
  year: string
  month: string
  slug: string
}

async function getArticle(params: ArticleParams) {
  'use cache'
  return await firstValueFrom(
    sanityClient.fetch(ARTICLE_QUERY, {
      ...params,
      baseUrl: null,
    }),
  )
}
