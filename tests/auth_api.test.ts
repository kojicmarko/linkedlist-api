import supertest from "supertest";
import { prisma } from "../prisma/index";
import app from "../src/app";
import { user, newUser, loginUser } from "./auth_test_helper";
import { redisClient } from "../src/app";

const api = supertest(app);

describe("User Registration & Authentication", () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        passwordHash: user.password,
      },
    });
  });

  describe("POST /api/auth/register/", () => {
    it("Can register a valid User", async () => {
      expect(await prisma.user.count()).toBe(1);

      await api.post("/api/auth/register/").send(newUser).expect(201);

      expect(await prisma.user.count()).toBe(2);
    });
  });

  describe("POST /api/auth/login/", () => {
    it("Can login a User with valid credentials", async () => {
      await api.post("/api/auth/login").send(loginUser).expect(200);
    });
  });
});

// This is here cause jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
