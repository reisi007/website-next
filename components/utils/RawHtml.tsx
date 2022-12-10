export function RawHtml({
  className,
  html,
}: { className?: string, html: string }) {
  // eslint-disable-next-line react/no-danger
  return (<div dangerouslySetInnerHTML={{ __html: html }} className={className} />);
}
