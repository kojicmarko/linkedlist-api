// import { getPostByIdPersistance } from "../../persistance/posts";

import { getCommentByIdPersistance } from "../../persistance/comments";

export const getCommentByIdInteractor = async (id: string) => {
  const comment = await getCommentByIdPersistance(id);

  if (!comment) {
    return undefined;
  }

  const commentDTO = {
    content: comment.content,
    children: comment.children,
    author: comment.author.username,
    commentLikes: comment.commentLikes,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };

  return commentDTO;
};
