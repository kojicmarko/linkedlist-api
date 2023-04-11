import { prisma } from "../../../prisma";

export const deletePostPersistance = async (id: string) => {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
};
