import Page from '@app/common/components/page';
import SEO from '@app/common/components/seo';

export default function Home() {
  return (
    <Page authRequired>
      <SEO title='Demo' description='Demo page' />
      demo
    </Page>
  );
}
