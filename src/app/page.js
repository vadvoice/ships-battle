import Image from 'next/image';
import Link from 'next/link';
import NextImg from '../../public/next.svg';
import VercelImg from '../../public/vercel.svg';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/game">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Here we{' '}
          <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">
            goooooo
          </span>
        </h1>
      </Link>

      <div className="flex justify-between w-full">
        <Image src={VercelImg} alt="vercel" />
        <Image src={NextImg} alt="nextJS" />
      </div>
    </main>
  );
}
