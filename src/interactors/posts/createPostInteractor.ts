import { createPostPersistance } from "../../persistance/posts/";
import { PostEntry } from "../../utils/types";
import { getUserByIdInteractor } from "../users";

export const createPostInteractor = async (userId: string, post: PostEntry) => {
  const user = await getUserByIdInteractor(userId);

  if (!user || !post.title || !post.content) {
    return { ERROR: "Invalid Post" };
  }

  return await createPostPersistance(userId, post);
};
