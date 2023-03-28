import { Tag } from '@/libs/microcms';
import TagItem from '../TagItem';
import styles from './index.module.css';

type Props = {
  tags?: Tag[];
  hasLink?: boolean;
};

export default function Tags({ tags, hasLink = true }: Props) {
  if (!tags) {
    return null;
  }
  return (
    <ul className={styles.tags}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <TagItem tag={tag} hasLink={hasLink} />
        </li>
      ))}
    </ul>
  );
}
