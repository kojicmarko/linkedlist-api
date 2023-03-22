import { prisma } from "../../../prisma/index";
export const getAllUsersPersistance = async () => {
  return await prisma.user.findMany({
    include: {
      posts: true,
      comments: true,
    },
  });
};
