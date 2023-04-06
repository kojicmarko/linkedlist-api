import { getPostByIdPersistance } from "../../persistance/posts";

export const getPostByIdInteractor = async (id: string) => {
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
