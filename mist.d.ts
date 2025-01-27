type ReactHTMLProps<
  Tag extends keyof React.ReactHTML
> = React.ReactHTML[Tag] extends React.DetailedHTMLFactory<infer Attributes, infer Element>
  ? React.DetailedHTMLProps<Attributes, Element>
  : React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>

interface Mist_body extends ReactHTMLProps<'body'> {
}

declare namespace JSX {
  interface IntrinsicElements {
    body: Mist_body
  }
}
