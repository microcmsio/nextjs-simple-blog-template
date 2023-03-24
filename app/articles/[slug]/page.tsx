import { getDetail } from '@/libs/microcms';
import { formatDate, formatRichText } from '@/libs/utils';
import styles from './page.module.css';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Article({ params }: Props) {
  const data = await getDetail(params.slug);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.meta}>
        {data.writer && (
          <div className={styles.writer}>
            <picture>
              <source
                type="image/webp"
                srcSet={`${data.writer?.image?.url}?fm=webp&fit=crop&w=48&h=48 1x, ${data.writer?.image?.url}?fm=webp&fit=crop&w=48&h=48&dpr=2 2x`}
              />
              <img
                src={data.writer?.image?.url}
                alt=""
                className={styles.writerIcon}
                width={data.writer?.image?.width}
                height={data.writer?.image?.height}
              />
            </picture>
            <span className={styles.writerName}>{data.writer?.name}</span>
          </div>
        )}
        <div>
          <time>{formatDate(data.publishedAt || data.createdAt)}</time>
        </div>
      </div>
      <picture>
        <source
          type="image/webp"
          media="(max-width: 640px)"
          srcSet={`${data.thumbnail?.url}?fm=webp&w=414 1x, ${data.thumbnail?.url}?fm=webp&w=414&dpr=2 2x`}
        />
        <source
          type="image/webp"
          srcSet={`${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504 1x, ${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504&dpr=2 2x`}
        />
        <img
          src={data.thumbnail?.url}
          alt=""
          className={styles.thumbnail}
          width={data.thumbnail?.width}
          height={data.thumbnail?.height}
        />
      </picture>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: `${formatRichText(data.content)}`,
        }}
      />
    </main>
  );
}
