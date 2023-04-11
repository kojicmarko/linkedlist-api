import { prisma } from "../../../prisma";
import { UpdatePostEntry } from "../../utils/types";

export const updatePostPersistance = async ({
  id,
  content,
}: UpdatePostEntry) => {
  const post = await prisma.post.update({
    where: { id },
    data: { content },
  });

  return post;
};
