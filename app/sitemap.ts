import type { MetadataRoute } from 'next'
import { firstValueFrom } from 'rxjs'
import { sanityClient } from '../sanity-client'

const BASE_URL = 'https://fridayclub.co'

const SITEMAP_QUERY = `
  [
    {
      "url": $baseUrl,
      "lastModified": *[_type == "article"] | order(publishedAt desc)[0].publishedAt,
      "changeFrequency": "weekly",
      "priority": 1,
    },
    ...*[_type in ["artist", "track", "releaseGroup"]] {
      "url": select(
        _type == "artist" => array::join([$baseUrl, "artists", slug.current], "/"),
        _type == "track" => array::join([$baseUrl, "tracks", slug.current], "/"),
        _type == "releaseGroup" => array::join([$baseUrl, "release-groups", slug.current], "/"),
      ),
      "lastModified": coalesce(_updatedAt, _createdAt),
      "changeFrequency": "monthly"
    }[defined(url)]
  ]
`

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return firstValueFrom(
    sanityClient.fetch(SITEMAP_QUERY, {
      baseUrl: BASE_URL,
    }),
  )
}
