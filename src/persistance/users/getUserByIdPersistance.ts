import { prisma } from "../../../prisma/index";

export const getUserByIdPersistance = async (id: string) => {
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
