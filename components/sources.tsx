import type { ComponentType } from 'react'

type Sources = Partial<
  Record<'appleMusic' | 'spotify' | 'youtube', string | null>
>

interface Props {
  sources: Sources
}

const sourceNames: Record<keyof Sources, string> = {
  appleMusic: 'Apple Music',
  spotify: 'Spotify',
  youtube: 'YouTube',
}

const sourceUrls: Record<keyof Sources, (id: string) => string> = {
  appleMusic: id => `https://music.apple.com/gb/song/${id}`,
  spotify: id => `https://open.spotify.com/track/${id}`,
  youtube: id => `https://www.youtube.com/watch?v=${id}`,
}

export const Sources: ComponentType<Props> = ({ sources }) => (
  <ul>
    {Object.entries(sources)
      .filter(([, sourceValue]) => sourceValue !== null)
      .map(([sourceName, sourceValue]) => (
        <li key={sourceName}>
          <a key={sourceName} href={sourceUrl({ sourceName, sourceValue })}>
            {sourceNames[sourceName]}
          </a>
        </li>
      ))}
  </ul>
)

function sourceUrl({
  sourceName,
  sourceValue,
}: { sourceName: string; sourceValue: string }): `https://${string}` {
  if (sourceName in sourceUrls) {
    return sourceUrls[sourceName](sourceValue)
  }
  return 'https://'
}
