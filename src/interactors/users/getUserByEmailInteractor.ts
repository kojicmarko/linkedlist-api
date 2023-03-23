import { getUserByEmailPersistance } from "../../persistance/users/";

export const getUserByEmailInteractor = async (email: string) => {
  const user = await getUserByEmailPersistance(email);

  if (!user) {
    return undefined;
  }

  return user;
};
