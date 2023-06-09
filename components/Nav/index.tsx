import { Suspense } from 'react';
import SearchField from '@/components/SearchField';
import styles from './index.module.css';
import AllTagList from '../AllTagList';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <SearchField />
      <Suspense>
        {/* @ts-expect-error Server Component */}
        <AllTagList />
      </Suspense>
    </nav>
  );
}
