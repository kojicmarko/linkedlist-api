import { getUserByIdInteractor } from "../users";
import {
  getPostByIdPersistance,
  updatePostPersistance,
} from "../../persistance/posts";
import { UpdatePostEntry } from "../../utils/types";

export const updatePostInteractor = async (
  userId: string,
  { id, content }: UpdatePostEntry
) => {
  const user = await getUserByIdInteractor(userId);
  const post = await getPostByIdPersistance(id);

  if (!content) {
    return { ERROR: "Content is required" };
  }

  if (!user || !post) {
    return { ERROR: "Cannot update" };
  }

  return await updatePostPersistance({ id, content });
};
