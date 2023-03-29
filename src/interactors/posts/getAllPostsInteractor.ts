import { getAllPostsPersistance } from "../../persistance/posts";
import { PostDTO } from "../../utils/types";

export const getAllPostsInteractor = async (): Promise<PostDTO[]> => {
  const posts = await getAllPostsPersistance();

  return posts.map(
    ({
      title,
      content,
      comments,
      author,
      postLikes,
      createdAt,
      updatedAt,
    }) => ({
      title,
      content,
      comments,
      author: author.username,
      postLikes,
      createdAt,
      updatedAt,
    })
  );
};
