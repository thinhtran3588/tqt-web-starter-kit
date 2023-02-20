import SEO from '@app/common/components/seo';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <SEO />
      Hello world
      <div>
        <Link href='/demo'>Demo</Link>
        <Link href='/auth'>Auth</Link>
        <Link href='/auth/register'>Register</Link>
      </div>
    </div>
  );
}
