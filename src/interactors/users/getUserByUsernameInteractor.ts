import { getUserByUsernamePersistance } from "../../persistance/users/";

export const getUserByUsernameInteractor = async (username: string) => {
  const user = await getUserByUsernamePersistance(username);

  if (!user) {
    return undefined;
  }

  return user;
};
