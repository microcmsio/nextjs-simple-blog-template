import Image from 'next/image';
import Link from 'next/link';
import { getTagList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Nav from '@/components/Nav';
import './globals.css';
import styles from './layout.module.css';

export const metadata = {
  title: 'Simple Blog',
  description: 'A simple blog presented by microCMS',
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const tags = await getTagList({
    limit: LIMIT,
  });
  return (
    <html lang="ja">
      <body>
        <header className={styles.header}>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="SIMPLE"
              className={styles.logo}
              width={348}
              height={133}
              priority
            />
          </Link>
        </header>
        <Nav tags={tags.contents} />
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <p className={styles.cr}>© SIMPLE. All Rights Reserved 2023</p>
        </footer>
      </body>
    </html>
  );
}
