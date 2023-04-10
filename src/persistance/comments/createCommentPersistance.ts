import { prisma } from "../../../prisma/index";
import { CommentEntry } from "../../utils/types";

export const createCommentPersistance = async (
  userId: string,
  postId: string,
  { content, parentId }: CommentEntry
) => {
  const post = await prisma.comment.create({
    data: {
      content,
      authorId: userId,
      postId,
      parentId,
    },
  });

  return post;
};
