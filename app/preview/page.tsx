import { getDetail } from '@/libs/microcms';
import Article from '@/components/Article';

type Props = {
  searchParams: {
    slug?: string;
    draftKey?: string;
  };
};

// キャッシュ利用せず、SSR扱い
export const revalidate = 0;

export default async function Page({ searchParams }: Props) {
  if (!searchParams.slug || !searchParams.draftKey) {
    return null;
  }
  const data = await getDetail(searchParams.slug, {
    draftKey: searchParams.draftKey,
  });

  return <Article data={data} />;
}
