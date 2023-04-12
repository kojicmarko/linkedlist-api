import { prisma } from "../../../prisma";

export const deleteCommentPersistance = async (id: string) => {
  return await prisma.comment.delete({
    where: {
      id,
    },
  });
};
