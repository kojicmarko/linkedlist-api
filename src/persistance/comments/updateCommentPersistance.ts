import { prisma } from "../../../prisma";
import { UpdateCommentEntry } from "../../utils/types";

export const updateCommentPersistance = async ({
  id,
  content,
}: UpdateCommentEntry) => {
  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return comment;
};
