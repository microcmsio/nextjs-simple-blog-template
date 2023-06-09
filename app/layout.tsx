import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'Simple Blog',
  description: 'A simple blog presented by microCMS',
  openGraph: {
    title: 'Simple Blog',
    description: 'A simple blog presented by microCMS',
    images: '/og-image.png',
  },
  alternates: {
    canonical: '/',
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <Nav />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
