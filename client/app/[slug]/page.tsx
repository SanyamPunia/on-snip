import { redis } from "@/lib/redis";
import Room from "./Room";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const initialData = await redis.lrange(`room:${slug}:comments`, 0, -1);
  const comments: { text: string; id: string }[] = initialData.map(
    (item, index) => ({
      text: item,
      id: `initial-${index}`,
    })
  );

  await redis.incr("served-requests");

  return <Room room={slug} initialData={comments} />;
};

export default Page;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `on-snip | ${params.slug}`,
  };
}
