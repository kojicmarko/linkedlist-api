import { getPostByIdPersistance } from "../../persistance/posts";
import { PostDTO } from "../../utils/types";

export const getPostByIdInteractor = async (
  id: string
): Promise<PostDTO | undefined> => {
  const post = await getPostByIdPersistance(id);

  if (!post) {
    return undefined;
  }

  const postDTO = {
    title: post.title,
    content: post.content,
    comments: post.comments,
    author: post.author.username,
    postLikes: post.postLikes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  return postDTO;
};
