import { prisma } from "../../prisma/index";

export const getUserPersistance = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      posts: true,
      comments: true,
    },
  });
};
