import supertest from "supertest";
import app from "../src/app";
import { redisClient } from "../src/app";
import { prisma } from "../prisma/";
import { Comment, Post, User } from "@prisma/client";
import {
  TestHeader,
  existingUser,
  validComment,
  validUser,
} from "./test_helper";
import { registerUserInteractor } from "../src/interactors/auth";
import { createPostInteractor } from "../src/interactors/posts";

const api = supertest(app);

describe("Comments", () => {
  beforeEach(async () => {
    const { email, username, password } = existingUser;
    const mockUser = await registerUserInteractor({
      email,
      username,
      password,
    });

    const { id } = mockUser as User;

    const mockPost = await createPostInteractor(id, {
      title: "Test Post 1",
      content: "This is test Post 1.",
    });

    const post = mockPost as Post;

    const mockComments = [
      {
        content: "Comment 1",
        authorId: id,
        postId: post.id,
      },
      {
        content: "Comment 2",
        authorId: id,
        postId: post.id,
      },
    ];
    await prisma.comment.createMany({ data: mockComments });
  });

  describe("GET /api/posts/:id/comments", () => {
    it("Returns Comments as JSON", async () => {
      const post = await api.get("/api/posts");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = post.body[0].id as string;

      const res = await api.get(`/api/posts/${postId}/comments`);
      expect(res.body).toHaveLength(2);
    });
    it("Returns a single Comment", async () => {
      const post = await api.get("/api/posts");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = post.body[0].id as string;

      await api.get(`/api/posts/${postId}/comments`).expect(200);
    });
  });

  // Saved me: https://github.com/ladjs/supertest/issues/665
  // TODO: Try to figure out TypeScript weirdness
  describe("POST /api/posts/:id/comments", () => {
    it("Creates a new Comment", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const post = await api.get("/api/posts");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = post.body[0].id as string;

      await api
        .post(`/api/posts/${postId}/comments`)
        .set({ cookie: header["set-cookie"] })
        .send(validComment)
        .expect(201);
    });
    it("Fails if Comment is invalid", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const post = await api.get("/api/posts");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = post.body[0].id as string;

      const res = await api
        .post(`/api/posts/${postId}/comments`)
        .set({ cookie: header["set-cookie"] })
        .send("")
        .expect(400);

      expect(res.body).toEqual({ ERROR: "Invalid Comment" });
    });
  });

  describe("PUT /api/posts/:id/comments/:id", () => {
    it("Can be edited by User who created it", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const posts = await api.get("/api/posts");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = posts.body[0].id as string;

      const startComments = await api.get(`/api/posts/${postId}/comments`);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const uneditedComment = startComments.body[0] as Comment;

      const editedComment = {
        content: "Edited Comment!",
      };

      await api
        .put(`/api/posts/${postId}/comments/${uneditedComment.id}`)
        .set({ cookie: header["set-cookie"] })
        .send(editedComment)
        .expect(200);

      const endComments = await api.get(`/api/posts/${postId}/comments`);
      const commentList = endComments.body as Comment[];
      const comment = commentList.find(
        (comment) => comment.id === uneditedComment.id
      );

      if (comment) {
        expect(comment.content).toBe("Edited Comment!");
      }
    });
  });

  describe("DELETE /api/posts/:id/comments/:id", () => {
    it("Can be deleted by User who created it", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const posts = await api.get("/api/posts");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const postId = posts.body[0].id as string;

      const startComments = await api.get(`/api/posts/${postId}/comments`);
      const startCommentsList = startComments.body as Comment[];

      const commentToDelete = startCommentsList[0];

      await api
        .delete(`/api/posts/${postId}/comments/${commentToDelete.id}`)
        .set({ cookie: header["set-cookie"] })
        .expect(204);

      const endComments = await api.get(`/api/posts/${postId}/comments/`);
      const endCommentsList = endComments.body as Comment[];
      expect(endCommentsList).toHaveLength(startCommentsList.length - 1);

      const comments = endCommentsList.map((comment) => comment.content);
      expect(comments).not.toContain(commentToDelete.content);
    });
  });
});

// This is here cause Jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
