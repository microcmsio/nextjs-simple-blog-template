import { notFound } from 'next/navigation';
import { getDetail } from '@/libs/microcms';
import Article from '@/components/Article';

type Props = {
  searchParams: {
    slug?: string;
    draftKey?: string;
  };
};

export const revalidate = 0;

export default async function Page({ searchParams }: Props) {
  if (!searchParams.slug || !searchParams.draftKey) {
    notFound();
  }
  const data = await getDetail(searchParams.slug, {
    draftKey: searchParams.draftKey,
  });

  return <Article data={data} />;
}
