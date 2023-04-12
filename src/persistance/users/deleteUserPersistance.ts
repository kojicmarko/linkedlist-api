import { prisma } from "../../../prisma";

export const deleteUserPersistance = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};
