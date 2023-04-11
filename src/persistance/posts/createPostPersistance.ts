import { prisma } from "../../../prisma/";
import { PostEntry } from "../../utils/types";

export const createPostPersistance = async (
  userId: string,
  { title, content }: PostEntry
) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
    },
  });

  return post;
};
