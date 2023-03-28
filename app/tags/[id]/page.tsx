import { getList, getTag } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ListItem from '@/components/ListItem';
import TagItem from '@/components/TagItem';
import styles from './page.module.css';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const data = await getList({
    limit: LIMIT,
    filters: `tags[contains]${params.id}`,
  });
  const tag = await getTag(params.id);
  return (
    <div>
      <p className={styles.title}>
        <TagItem tag={tag} hasLink={false} />
        の記事一覧
      </p>
      <ul>
        {data.contents.map((article) => (
          <ListItem key={article.id} article={article} />
        ))}
      </ul>
      <Pagination totalCount={data.totalCount} />
    </div>
  );
}
