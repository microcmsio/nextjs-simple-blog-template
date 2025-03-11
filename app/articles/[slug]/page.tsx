import { Metadata } from 'next';
import { metadata as layoutMetadata } from '@/app/layout';
import { getDetail } from '@/libs/microcms';
import Article from '@/components/Article';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return {
    title: data.title + ' | ' + layoutMetadata.title,
    description: data.description,
    openGraph: {
      title: data.title + ' | ' + layoutMetadata.title,
      description: data.description,
      images: [data?.thumbnail?.url || ''],
    },
    alternates: {
      canonical: `/articles/${params.slug}`,
    },
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return <Article data={data} />;
}
