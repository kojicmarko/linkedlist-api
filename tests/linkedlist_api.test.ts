import { registerUserInteractor } from "../src/interactors/auth";
import { User } from "@prisma/client";
import helper from "./test_helper";
import { prisma } from "../prisma";
import supertest from "supertest";
import app from "../src/app";
import { redisClient } from "../src/app";

const api = supertest(app);

type testPost = {
  title: string;
  content: string;
  authorId: string;
};
type testComment = {
  content: string;
  authorId: string;
  postId: string;
};
let initialPosts: testPost[];
let initialComments: testComment[];

beforeEach(async () => {
  // Empty database
  await prisma.user.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.comment.deleteMany({});

  // Create two Users
  const userOne = (await registerUserInteractor(helper.userOne)) as User;
  const userTwo = (await registerUserInteractor(helper.userTwo)) as User;

  // Create four Posts
  initialPosts = [
    {
      title: "Test Post 1",
      content: "This is test post 1.",
      authorId: userOne.id,
    },
    {
      title: "Test Post 2",
      content: "This is test post 2.",
      authorId: userOne.id,
    },
    {
      title: "Test Post 3",
      content: "This is test post 3.",
      authorId: userTwo.id,
    },
    {
      title: "Test Post 3",
      content: "This is test post 3.",
      authorId: userTwo.id,
    },
  ];
  await prisma.post.createMany({ data: initialPosts });

  // Create two Comments
  const postOne = (await helper.postsInDB())[0];

  initialComments = [
    {
      content: "Comment 1",
      authorId: userOne.id,
      postId: postOne.id,
    },
    {
      content: "Comment 2",
      authorId: userTwo.id,
      postId: postOne.id,
    },
  ];
  await prisma.comment.createMany({ data: initialComments });
});

afterAll(async () => {
  redisClient.disconnect();
  await prisma.$disconnect();
});

describe("LinkedList API", () => {
  describe("Authentication", () => {
    describe("POST /api/auth/register", () => {
      it("Can register a valid User", async () => {
        expect(await prisma.user.count()).toBe(2);

        await api.post("/api/auth/register").send(helper.newUser).expect(201);

        expect(await prisma.user.count()).toBe(3);
      });

      it("Fails if User already exists", async () => {
        expect(await prisma.user.count()).toBe(2);

        const res = await api
          .post("/api/auth/register/")
          .send(helper.userOne)
          .expect(400);

        expect(res.body).toEqual({
          ERROR: "User Already Exists",
        });

        expect(await prisma.user.count()).toBe(2);
      });

      it("Fails if username is too short", async () => {
        const badUser = {
          email: "mail@mail.com",
          username: "jd",
          password: "johndoe",
        };

        expect(await prisma.user.count()).toBe(2);

        const res = await api
          .post("/api/auth/register")
          .send(badUser)
          .expect(400);

        expect(res.body).toEqual({
          ERROR: "Username must be between 4 and 16 characters",
        });

        expect(await prisma.user.count()).toBe(2);
      });
      it("Fails if password is too short", async () => {
        const badUser = {
          email: "mail@mail.com",
          username: "johndoe",
          password: "jd",
        };

        expect(await prisma.user.count()).toBe(2);

        const res = await api
          .post("/api/auth/register")
          .send(badUser)
          .expect(400);

        expect(res.body).toEqual({
          ERROR: "Password must be minimum 6 characters",
        });

        expect(await prisma.user.count()).toBe(2);
      });
    });
    describe("POST /api/auth/login/", () => {
      it("Can login a User with valid credentials", async () => {
        await api.post("/api/auth/login").send(helper.userOne).expect(200);
      });

      it("Fails with invalid credentials", async () => {
        const badUser = {
          email: "mail@mail.com",
          password: "jd",
        };

        const res = await api.post("/api/auth/login").send(badUser).expect(401);

        expect(res.body).toEqual({
          ERROR: "Invalid Credentials",
        });
      });
    });
  });
  describe("Users", () => {
    let cookie: object;
    beforeEach(async () => {
      // User login
      const res = await api.post("/api/auth/login").send(helper.userOne);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      cookie = { cookie: res.headers["set-cookie"] };
    });
    describe("DELETE /api/users/:id", () => {
      it("Can delete Users account", async () => {
        const aUserAtStart = (await helper.usersInDB())[0];

        await api
          .delete(`/api/users/${aUserAtStart.id}`)
          .set(cookie)
          .expect(204);

        const usersAtEnd = await helper.usersInDB();
        expect(usersAtEnd).toHaveLength(1);

        const users = usersAtEnd.map((user) => user.id);
        expect(users).not.toContain(aUserAtStart.id);
      });
    });
  });

  describe("Posts", () => {
    let cookie: object;
    beforeEach(async () => {
      // User login
      const res = await api.post("/api/auth/login").send(helper.userOne);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      cookie = { cookie: res.headers["set-cookie"] };
    });
    describe("GET /api/posts", () => {
      it("Returns Posts as JSON", async () => {
        const res = await api.get("/api/posts/");
        expect(res.body).toHaveLength(initialPosts.length);
      });
    });

    describe("POST /api/posts", () => {
      it("Creates a new Post", async () => {
        await api
          .post("/api/posts/")
          .set(cookie)
          .send(helper.newPost)
          .expect(201);

        const postsAtEnd = await helper.postsInDB();
        expect(postsAtEnd).toHaveLength(initialPosts.length + 1);
      });
      it("Fails if Post is invalid", async () => {
        const res = await api
          .post("/api/posts/")
          .set(cookie)
          .send({ content: "Bad Post." })
          .expect(400);

        expect(res.body).toEqual({ ERROR: "Invalid Post" });
      });
    });
    describe("PUT /api/posts", () => {
      it("Can be edited by User who created it", async () => {
        const aPostAtStart = (await helper.postsInDB())[0];

        const editedPost = {
          content: "Edited!",
        };

        await api
          .put(`/api/posts/${aPostAtStart.id}`)
          .set(cookie)
          .send(editedPost)
          .expect(200);

        const postsAtEnd = await helper.postsInDB();
        const aPostAtEnd = postsAtEnd.find(
          (post) => post.id === aPostAtStart.id
        );

        if (aPostAtEnd) {
          expect(aPostAtEnd.content).toBe("Edited!");
        }
      });
    });
    describe("DELETE /api/posts/", () => {
      it("Can be deleted by User who created it", async () => {
        const aPostAtStart = (await helper.postsInDB())[0];

        await api
          .delete(`/api/posts/${aPostAtStart.id}`)
          .set(cookie)
          .expect(204);

        const postsAtEnd = await helper.postsInDB();
        expect(postsAtEnd).toHaveLength(initialPosts.length - 1);

        const titles = postsAtEnd.map((post) => post.title);
        expect(titles).not.toContain(aPostAtStart.title);
      });
    });
  });
  describe("Comments", () => {
    let cookie: object;
    beforeEach(async () => {
      // User login
      const res = await api.post("/api/auth/login").send(helper.userOne);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      cookie = { cookie: res.headers["set-cookie"] };
    });
    describe("GET /api/posts/:id/comments/", () => {
      it("Returns Comments as JSON", async () => {
        const postId = (await helper.postsInDB())[0].id;

        const res = await api.get(`/api/posts/${postId}/comments`);
        expect(res.body).toHaveLength(initialComments.length);
      });
    });
    describe("POST /api/posts/:id/comments", () => {
      it("Creates a new Comment", async () => {
        const postId = (await helper.postsInDB())[0].id;

        await api
          .post(`/api/posts/${postId}/comments`)
          .set(cookie)
          .send(helper.newComment)
          .expect(201);

        const commentsAtEnd = await helper.commentsInDB();
        expect(commentsAtEnd).toHaveLength(initialComments.length + 1);
      });
      it("Fails if Comment is invalid", async () => {
        const postId = (await helper.postsInDB())[0].id;

        const res = await api
          .post(`/api/posts/${postId}/comments`)
          .set(cookie)
          .send("")
          .expect(400);

        expect(res.body).toEqual({ ERROR: "Invalid Comment" });
      });
    });
    describe("PUT /api/posts/:id/comments/:id/", () => {
      it("Can be edited by User who created it", async () => {
        const postId = (await helper.postsInDB())[0].id;
        const aCommentAtStart = (await helper.commentsInDB())[0];

        const editedComment = {
          content: "Edited Comment!",
        };

        await api
          .put(`/api/posts/${postId}/comments/${aCommentAtStart.id}`)
          .set(cookie)
          .send(editedComment)
          .expect(200);

        const commentsAtEnd = await helper.commentsInDB();
        const aCommentAtEnd = commentsAtEnd.find(
          (comment) => comment.id === aCommentAtStart.id
        );

        if (aCommentAtEnd) {
          expect(aCommentAtEnd.content).toBe("Edited Comment!");
        }
      });
    });
    describe("DELETE /api/posts/:id/comments/:id/", () => {
      it("Can be deleted by User who created it", async () => {
        const postId = (await helper.postsInDB())[0].id;
        const aCommentAtStart = (await helper.commentsInDB())[0];

        await api
          .delete(`/api/posts/${postId}/comments/${aCommentAtStart.id}`)
          .set(cookie)
          .expect(204);

        const commentsAtEnd = await helper.commentsInDB();
        expect(commentsAtEnd).toHaveLength(initialComments.length - 1);

        const comments = commentsAtEnd.map((comment) => comment.content);
        expect(comments).not.toContain(aCommentAtStart.content);
      });
    });
  });
});
