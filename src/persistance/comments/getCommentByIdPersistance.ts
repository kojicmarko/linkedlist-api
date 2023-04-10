import { prisma } from "../../../prisma/index";

export const getCommentByIdPersistance = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      children: {
        select: {
          id: true,
          parentId: true,
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
