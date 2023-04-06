import { getUserByIdPersistance } from "../../persistance/users/";
import { createPostPersistance } from "../../persistance/posts/";
import { PostEntry } from "../../utils/types";

export const createPostInteractor = async (userId: string, post: PostEntry) => {
  const user = await getUserByIdPersistance(userId);

  if (!user || !post.title || !post.content) {
    return { ERROR: "Invalid Post" };
  }

  return await createPostPersistance(userId, post);
};
