import { prisma } from "../../../prisma/index";

export const getUserByEmailPersistance = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};
