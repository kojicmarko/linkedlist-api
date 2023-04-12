import { getUserByIdInteractor } from "../users";
import {
  getCommentByIdPersistance,
  updateCommentPersistance,
} from "../../persistance/comments";
import { UpdateCommentEntry } from "../../utils/types";

export const updateCommentInteractor = async (
  userId: string,
  { id, content }: UpdateCommentEntry
) => {
  const user = await getUserByIdInteractor(userId);
  const comment = await getCommentByIdPersistance(id);

  if (!content) {
    return { ERROR: "Content is required" };
  }

  if (!user || !comment) {
    return { ERROR: "Cannot update" };
  }

  return await updateCommentPersistance({ id, content });
};
