import { Metadata } from 'next';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    alternates: {
      canonical: `/p/${params.current}`,
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} />
    </>
  );
}
