import { getUserByIdPersistance } from "../../persistance/users";
import { UserDTO } from "../../utils/types";

export const getUserByIdInteractor = async (
  id: string
): Promise<UserDTO | undefined> => {
  const user = await getUserByIdPersistance(id);

  if (!user) {
    return undefined;
  }

  const userDTO = {
    username: user.username,
    posts: user.posts,
    comments: user.comments,
    postLikes: user.postLikes,
    commentLikes: user.commentLikes,
    createdAt: user.createdAt,
  };

  return userDTO;
};
