import {
  deletePostPersistance,
  getPostByIdPersistance,
} from "../../persistance/posts";
import { getUserByIdInteractor } from "../users";

export const deletePostInteractor = async (userId: string, id: string) => {
  const user = await getUserByIdInteractor(userId);
  const post = await getPostByIdPersistance(id);

  if (!user || !post) {
    return { ERROR: "Cannot Delete" };
  }

  if (user.username !== post.author.username) {
    return { ERROR: "Only the creator can delete a Post" };
  }

  return await deletePostPersistance(id);
};
