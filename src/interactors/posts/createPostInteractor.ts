import { getUserByIdPersistance } from "../../persistance/users/";
import { createPostPersistance } from "../../persistance/posts/";
import { PostEntry } from "../../utils/types";

export const createPostInteractor = async (userId: string, post: PostEntry) => {
  const user = await getUserByIdPersistance(userId);
  if (!user) {
    return undefined;
  }

  return await createPostPersistance(userId, post);
};
