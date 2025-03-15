import type { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
type SEOProperties = {
  readonly pageTitle: string;
  readonly keywords?: string[];
  readonly language?: string;
  readonly description?: string;
}


export function SEO({
  pageTitle,
  keywords = [],
  language = 'fa-IR',
  description,
}: SEOProperties):ReactElement {
  return (
    <Helmet
      title={pageTitle}
      htmlAttributes={{ lang: language }}
      meta={[
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: keywords.join(','),
        },
      ]}
    />
  );
}
