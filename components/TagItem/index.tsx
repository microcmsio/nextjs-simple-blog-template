import Link from 'next/link';
import { Tag } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag;
  hasLink?: boolean;
};

export default function TagItem({ tag, hasLink = true }: Props) {
  return (
    <li className={styles.list}>
      {hasLink ? (
        <Link href={`/tags/${tag.id}`} className={styles.link}>
          #{tag.name}
        </Link>
      ) : (
        <span className={styles.link}>#{tag.name}</span>
      )}
    </li>
  );
}
