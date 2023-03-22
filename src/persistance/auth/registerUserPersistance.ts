import { prisma } from "../../../prisma/index";
import { UserEntryPersistance } from "../../utils/types";

export const registerUserPersistance = async ({
  email,
  username,
  passwordHash,
}: UserEntryPersistance) => {
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });

  return user;
};
