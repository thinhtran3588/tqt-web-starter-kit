import Image from 'next/image';
import Link from 'next/link';

interface Props {
  children?: React.ReactNode;
}

export default function Layout({children}: Props) {
  return (
    <main className='flex w-screen h-screen flex-col p-2 bg-'>
      <Link href='/'>
        <Image priority src='/assets/black-icon.svg' height={96} width={96} alt='Home page' />
      </Link>
      <div className='flex-1 flex justify-center items-center'>{children}</div>
    </main>
  );
}
