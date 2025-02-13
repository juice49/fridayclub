import { Analytics } from '@vercel/analytics/next'
import localFont from 'next/font/local'
import '../mist.css'
import type { Metadata } from 'next'

const myFont = localFont({
  src: '../fonts/MonaspaceNeonVarVF[wght,wdth,slnt].woff2',
  display: 'swap',
  variable: '--font-monaspace',
})

export const metadata: Metadata = {
  title: {
    template: '%s - fridayclub',
    default: 'fridayclub is a music blog',
  },
  description: 'fridayclub is a music blog.',
  authors: [
    {
      name: 'Ash',
      url: 'https://ash.gd',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={myFont.variable}>
      <body>
        <p>fridayclub is a music blog. fridayclub is under construction 🚧.</p>
        {children}
        <footer>
          <p>***</p>
          <p>
            This is just a fun place for me to write about music and other art,
            so it's <s>a bit</s> very messy at the moment.
          </p>
          <p>
            Made by <a href='https://ash.gd'>Ash</a> / Powered by{' '}
            <a href='https://sanity.io'>Sanity</a>
          </p>
          <p>
            <a href='https://github.com/juice49/fridayclub'>View source</a>
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
