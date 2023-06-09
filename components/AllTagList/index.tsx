import TagList from '@/components/TagList';
import { getTagList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export default async function AllTagList() {
  const tags = await getTagList({
    limit: LIMIT,
  });
  return <TagList tags={tags.contents} />;
}
