import { Tag } from '@/libs/microcms';
import TagList from '@/components/TagList';
import SearchField from '@/components/SearchField';
import styles from './index.module.css';
import { Suspense } from 'react';

type Props = {
  tags: Tag[];
};

export default function Nav({ tags }: Props) {
  return (
    <nav className={styles.nav}>
      <Suspense fallback={<input type="search" className="loading" placeholder="Loading..." />}>
        <SearchField />
      </Suspense>
      <TagList tags={tags} />
    </nav>
  );
}
