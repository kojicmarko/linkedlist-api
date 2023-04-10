import { createCommentPersistance } from "../../persistance/comments";
import { CommentEntry } from "../../utils/types";
import { getPostByIdInteractor } from "../posts";
import { getUserByIdInteractor } from "../users";

export const createCommentInteractor = async (
  userId: string,
  postId: string,
  comment: CommentEntry
) => {
  const user = await getUserByIdInteractor(userId);
  const post = await getPostByIdInteractor(postId);

  if (!user || !post || !comment.content) {
    return { ERROR: "Invalid Comment" };
  }

  return await createCommentPersistance(userId, postId, comment);
};
