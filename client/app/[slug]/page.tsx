// import { redis } from "@/lib/redis";
// import Room from "./Room";

// interface PageProps {
//   params: {
//     slug: string;
//   };
// }

// const Page = async ({ params }: PageProps) => {
//   const { slug } = params;

//   // const initialData = await redis.zrange<string[]>(`room:${slug}`, 0, -1, {
//   //   withScores: true,
//   // });

//   const initialData = await redis.lrange(`room:${slug}:comments`, 0, -1);
//   const comments: { text: string; id: string }[] = [];

//   for (let i = 0; i < initialData.length; i++) {
//     const [text, id] = initialData.slice(i, i + 2);

//     if (typeof text === "string" && typeof id === "string") {
//       comments.push({ text, id });
//     }
//   }

//   await redis.incr("served-requests");

//   return <Room room={slug} initialData={comments} />;
// };

// export default Page;

import { redis } from "@/lib/redis";
import Room from "./Room";

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
