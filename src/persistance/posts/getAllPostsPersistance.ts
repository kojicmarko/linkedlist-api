import { prisma } from "../../../prisma/index";

export const getAllPostsPersistance = async () => {
  return await prisma.post.findMany({
    include: {
      comments: true,
      postLikes: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};
