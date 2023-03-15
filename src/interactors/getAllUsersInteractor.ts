import { getAllUsersPersistance } from "../persistance/getAllUsersPersistance";
import { UserDTO } from "../utils/types";

export const getAllUsersInteractor = async (): Promise<UserDTO[]> => {
  const users = await getAllUsersPersistance();

  return users.map(({ username, posts, comments, createdAt }) => ({
    username,
    posts,
    comments,
    createdAt,
  }));
};
