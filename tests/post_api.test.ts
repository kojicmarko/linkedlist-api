import supertest from "supertest";
import app from "../src/app";
import { redisClient } from "../src/app";
import { prisma } from "../prisma/";
import { User } from "@prisma/client";

const api = supertest(app);

describe("Posts", () => {
  let mockUser: User;
  beforeEach(async () => {
    mockUser = await prisma.user.create({
      data: {
        email: "testing@testmail.com",
        username: "testing",
        passwordHash: "testing",
      },
    });

    const mockPosts = [
      {
        title: "Test Post 1",
        content: "This is test post 1.",
        authorId: mockUser.id,
      },
      {
        title: "Test Post 2",
        content: "This is test post 2.",
        authorId: mockUser.id,
      },
    ];

    await prisma.post.createMany({ data: mockPosts });
  });

  describe("GET /api/posts", () => {
    it("Returns Posts as JSON", async () => {
      const res = await api.get("/api/posts").expect(200);
      expect(res.body).toHaveLength(2);
    });
  });
});

// This is here cause Jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
