import {
  deleteCommentPersistance,
  getCommentByIdPersistance,
} from "../../persistance/comments";
import { getUserByIdInteractor } from "../users";

export const deleteCommentInteractor = async (userId: string, id: string) => {
  const user = await getUserByIdInteractor(userId);
  const comment = await getCommentByIdPersistance(id);

  if (!user || !comment) {
    return { ERROR: "Cannot Delete" };
  }

  if (user.username !== comment.author.username) {
    return { ERROR: "Only the creator can delete the Comment" };
  }

  return await deleteCommentPersistance(id);
};
