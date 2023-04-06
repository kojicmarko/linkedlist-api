import supertest from "supertest";
import app from "../src/app";
import { redisClient } from "../src/app";
import { prisma } from "../prisma/";
import { User } from "@prisma/client";
import {
  TestHeader,
  existingUser,
  invalidPost,
  validPost,
  validUser,
} from "./test_helper";
import { registerUserInteractor } from "../src/interactors/auth";

const api = supertest(app);

describe("Posts", () => {
  beforeEach(async () => {
    const { email, username, password } = existingUser;
    const mockUser = await registerUserInteractor({
      email,
      username,
      password,
    });

    const { id } = mockUser as User;
    const mockPosts = [
      {
        title: "Test Post 1",
        content: "This is test post 1.",
        authorId: id,
      },
      {
        title: "Test Post 2",
        content: "This is test post 2.",
        authorId: id,
      },
    ];

    await prisma.post.createMany({ data: mockPosts });
  });

  describe("GET /api/posts", () => {
    it("Returns Posts as JSON", async () => {
      const res = await api.get("/api/posts/").expect(200);
      expect(res.body).toHaveLength(2);
    });
    it("Returns a single Post", async () => {
      const posts = await api.get("/api/posts");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const id = posts.body[0].id as string;
      await api.get(`/api/posts/${id}`);
    });
  });

  // Saved me: https://github.com/ladjs/supertest/issues/665
  // TODO: Try to figure out TypeScript weirdness
  describe("POST /api/posts", () => {
    it("Creates a new Post", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      await api
        .post("/api/posts/")
        .set({ cookie: header["set-cookie"] })
        .send(validPost)
        .expect(201);
    });
    it("Fails if Post is invalid", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const res = await api
        .post("/api/posts/")
        .set({ cookie: header["set-cookie"] })
        .send(invalidPost)
        .expect(400);

      expect(res.body).toEqual({ ERROR: "Invalid Post" });
    });
  });
});

// This is here cause Jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
