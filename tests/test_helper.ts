import { PORT } from "../src/utils/config";
import { getAllCommentsInteractor } from "../src/interactors/comments";
import { getAllPostsInteractor } from "../src/interactors/posts";
import { getAllUsersInteractor } from "../src/interactors/users";

const url = `http://localhost:${PORT}`;

const userOne = {
  email: "userone@mail.com",
  username: "userone",
  password: "password",
};

const userTwo = {
  email: "usertwo@mail.com",
  username: "usertwo",
  password: "password",
};

const newUser = {
  email: "test@mail.com",
  username: "test",
  password: "password",
};

const usersInDB = async () => {
  return await getAllUsersInteractor();
};

const newPost = {
  title: "New Test Post",
  content: "This is a new test post.",
};

const postsInDB = async () => {
  return await getAllPostsInteractor();
};

const newComment = {
  content: "This is a new comment.",
};

const commentsInDB = async () => {
  return await getAllCommentsInteractor();
};

export default {
  url,
  userOne,
  userTwo,
  newUser,
  usersInDB,
  newPost,
  postsInDB,
  newComment,
  commentsInDB,
};
