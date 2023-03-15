import { getUserPersistance } from "../persistance/getUserPersistance";
import { UserDTO } from "../utils/types";

export const getUserInteractor = async (
  id: string
): Promise<UserDTO | undefined> => {
  const user = await getUserPersistance(id);

  if (!user) {
    return undefined;
  }

  const userDTO = {
    username: user.username,
    posts: user.posts,
    comments: user.comments,
    createdAt: user.createdAt,
  };

  return userDTO;
};
