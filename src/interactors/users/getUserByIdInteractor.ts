import { getUserByIdPersistance } from "../../persistance/users";

export const getUserByIdInteractor = async (id: string) => {
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
