import { Metadata } from 'next';
import { getList } from '@/libs/microcms';
import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  return {
    title: '「' + searchParams.q + '」の検索結果',
    openGraph: {
      title: '「' + searchParams.q + '」の検索結果',
    },
    alternates: {
      canonical: `/search?q=${searchParams.q}`,
    },
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const data = await getList({
    q: searchParams.q,
  });

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath="/search" q={searchParams.q} />
    </>
  );
}
