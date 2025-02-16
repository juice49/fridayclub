export const INTERNAL_LINK_FRAGMENT = `
  _type == "internalLink" => {
    "path": "/" + array::join(
      array::compact(
        [
          select(
            @->_type == "track" => "tracks",
            @->_type == "artist" => "artists",
            @->_type == "releaseGroup" => "release-groups"
          ),
          @->slug.current
        ]
      ),
      "/"
    )
  }
`

export const LIST_ARTICLES_QUERY = `
  *[_type == "article" && column == "weeklyRoundup"] {
      _id,
      title,
      column,
      publishedAt,
      "body": body[] {
        ...,
        ...select(
          _type == 'item' => {
            "subject": subject[]->{
              ...,
              ...select(
                _type == "track" => {
                  "artistsNames": artists[]->name,
                  "sources": {
                    "appleMusic": sources.appleMusic,
                    "spotify": sources.spotify,
                    "youtube": sources.youtube
                  },
                  releaseGroup->{
                    name,
                    coverArt {
                      asset->{
                        url,
                        "aspectRatio": metadata.dimensions.aspectRatio
                      }
                    }
                  }
                }
              )
            },
            body[] {
              ...,
              markDefs[] {
                ...,
                ...select({
                  ${INTERNAL_LINK_FRAGMENT}
                })
              }
            }
          }
        ),
        ...select(_type == 'lyrics' => {
          "lyrics": lyrics,
          "trackTitle": track->title,
          "trackArtistsNames": track->artists[]->name,
          "sources": {
            "appleMusic": track->sources.appleMusic,
            "spotify": track->sources.spotify,
            "youtube": track->sources.youtube
          }
        }),
        markDefs[] {
          ...,
          ...select({
            ${INTERNAL_LINK_FRAGMENT}
          })
        }
      }
    } | order(publishedAt desc)
`
