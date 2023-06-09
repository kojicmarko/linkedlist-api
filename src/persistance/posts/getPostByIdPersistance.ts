import { prisma } from "../../../prisma/index";

export const getPostByIdPersistance = async (id: string) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      comments: {
        select: {
          id: true,
          parentId: true,
          content: true,
          author: {
            select: {
              username: true,
            },
          },
          commentLikes: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      postLikes: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};
