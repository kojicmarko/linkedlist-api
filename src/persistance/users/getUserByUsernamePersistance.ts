import { prisma } from "../../../prisma/index";

export const getUserByUsernamePersistance = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
};
