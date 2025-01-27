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
  if (sourceName === 'appleMusic') {
    return `https://music.apple.com/gb/song/${sourceValue}`
  }
  return 'https://'
}
