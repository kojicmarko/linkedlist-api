import { prisma } from "../../../prisma/index";

export const getPostByIdPersistance = async (id: string) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
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
