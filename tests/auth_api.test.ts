import supertest from "supertest";
import { prisma } from "../prisma/index";
import app from "../src/app";
import {
  existingUser,
  newUser,
  validUser,
  invalidUser,
} from "./auth_test_helper";
import { redisClient } from "../src/app";
import { registerUserInteractor } from "../src/interactors/auth";

const api = supertest(app);

describe("User Registration & Authentication", () => {
  beforeEach(async () => {
    const { email, username, password } = existingUser;
    await registerUserInteractor({
      email,
      username,
      password,
    });
  });

  describe("POST /api/auth/register/", () => {
    it("Can register a valid User", async () => {
      expect(await prisma.user.count()).toBe(1);

      await api.post("/api/auth/register/").send(newUser).expect(201);

      expect(await prisma.user.count()).toBe(2);
    });

    it("Fails if User already exists", async () => {
      expect(await prisma.user.count()).toBe(1);

      const res = await api
        .post("/api/auth/register/")
        .send(existingUser)
        .expect(400);

      expect(res.body).toEqual({
        ERROR: "User Already Exists",
      });

      expect(await prisma.user.count()).toBe(1);
    });

    it("Fails if username is too short", async () => {
      const user = {
        email: "mail@mail.com",
        username: "jd",
        password: "johndoe",
      };
      expect(await prisma.user.count()).toBe(1);

      const res = await api.post("/api/auth/register/").send(user).expect(400);

      expect(res.body).toEqual({
        ERROR: "Username must be between 4 and 16 characters",
      });

      expect(await prisma.user.count()).toBe(1);
    });

    it("Fails if password is too short", async () => {
      const user = {
        email: "mail@mail.com",
        username: "johndoe",
        password: "jd",
      };

      expect(await prisma.user.count()).toBe(1);

      const res = await api.post("/api/auth/register/").send(user).expect(400);

      expect(res.body).toEqual({
        ERROR: "Password must be minimum 6 characters",
      });

      expect(await prisma.user.count()).toBe(1);
    });
  });

  describe("POST /api/auth/login/", () => {
    it("Can login a User with valid credentials", async () => {
      await api.post("/api/auth/login").send(validUser).expect(200);
    });

    it("Rejects User with invalid credentials", async () => {
      const res = await api
        .post("/api/auth/login")
        .send(invalidUser)
        .expect(401);

      expect(res.body).toEqual({
        ERROR: "Invalid Credentials",
      });
    });
  });
});

// This is here cause Jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
