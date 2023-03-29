import { prisma } from "../../../prisma/index";

export const getAllUsersPersistance = async () => {
  return await prisma.user.findMany({
    include: {
      posts: {
        select: {
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      comments: true,
      postLikes: true,
      commentLikes: true,
    },
  });
};
