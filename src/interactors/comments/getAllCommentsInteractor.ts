import { getAllCommentsPersistance } from "../../persistance/comments";
import { CommentDTO } from "../../utils/types";

export const getAllCommentsInteractor = async (): Promise<CommentDTO[]> => {
  const comments = await getAllCommentsPersistance();

  return comments.map(
    ({
      id,
      content,
      children,
      author,
      commentLikes,
      createdAt,
      updatedAt,
    }) => ({
      id,
      content,
      children,
      author: author.username,
      commentLikes,
      createdAt,
      updatedAt,
    })
  );
};
