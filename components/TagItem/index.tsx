import Link from 'next/link';
import { Tag } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: Tag;
  hasLink?: boolean;
};

export default function TagItem({ tag, hasLink = true }: Props) {
  if (hasLink) {
    return (
      <Link href={`/tags/${tag.id}`} className={styles.link}>
        #{tag.name}
      </Link>
    );
  }
  return <span className={styles.link}>#{tag.name}</span>;
}
