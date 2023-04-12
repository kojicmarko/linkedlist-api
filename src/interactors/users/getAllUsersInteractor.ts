import { getAllUsersPersistance } from "../../persistance/users";
import { UserDTO } from "../../utils/types";

export const getAllUsersInteractor = async (): Promise<UserDTO[]> => {
  const users = await getAllUsersPersistance();

  return users.map(
    ({
      id,
      username,
      posts,
      comments,
      postLikes,
      commentLikes,
      createdAt,
    }) => ({
      id,
      username,
      posts,
      comments,
      postLikes,
      commentLikes,
      createdAt,
    })
  );
};
