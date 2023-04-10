import { prisma } from "../../../prisma/index";

export const getAllCommentsPersistance = async () => {
  return await prisma.comment.findMany({
    include: {
      children: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      commentLikes: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
};
