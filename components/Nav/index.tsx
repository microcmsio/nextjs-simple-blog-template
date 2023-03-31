import { Tag } from '@/libs/microcms';
import TagList from '@/components/TagList';
import SearchField from '@/components/SearchField';
import styles from './index.module.css';

type Props = {
  tags: Tag[];
};

export default function Nav({ tags }: Props) {
  return (
    <nav className={styles.nav}>
      <SearchField />
      <TagList tags={tags} />
    </nav>
  );
}
