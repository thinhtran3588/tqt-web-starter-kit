import {NextSeo} from 'next-seo';

interface Props {
  title?: string;
  description?: string;
}

export default function SEO({title, description}: Props) {
  return (
    <NextSeo
      title={title ? `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME}` : process.env.NEXT_PUBLIC_SITE_NAME}
      description={description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION}
    />
  );
}
