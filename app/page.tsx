'use cache'
import type { ComponentType } from 'react'
import { firstValueFrom } from 'rxjs'
import { Article } from '../components/article'
import { LIST_ARTICLES_QUERY } from '../queries/articles'
import { sanityClient } from '../sanity-client'

const Page: ComponentType = async () => {
  const articles = await firstValueFrom(
    sanityClient.fetch(LIST_ARTICLES_QUERY, {
      baseUrl: null,
    }),
  )

  return (
    <>
      <h1>fridayclub</h1>
      {articles.map(article => (
        <Article key={article._id} article={article} />
      ))}
    </>
  )
}

export default Page
