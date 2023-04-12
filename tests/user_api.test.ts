import supertest from "supertest";
import app from "../src/app";
import { redisClient } from "../src/app";
import { User } from "@prisma/client";
import { TestHeader, existingUser, validUser } from "./test_helper";
import { registerUserInteractor } from "../src/interactors/auth";

const api = supertest(app);

describe("Posts", () => {
  beforeEach(async () => {
    const { email, username, password } = existingUser;
    await registerUserInteractor({
      email,
      username,
      password,
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("Can delete Users account", async () => {
      const user = await api.post("/api/auth/login").send(validUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { header }: { header: TestHeader } = user;

      const startUsers = await api.get("/api/users");
      const startUsersList = startUsers.body as User[];

      const userToDelete = startUsersList[0];

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .set({ cookie: header["set-cookie"] })
        .expect(204);

      const endUsers = await api.get("/api/users");
      const endUsersList = endUsers.body as User[];
      expect(endUsersList).toHaveLength(startUsersList.length - 1);

      const usernames = endUsersList.map((user) => user.username);
      expect(usernames).not.toContain(userToDelete.username);
    });
  });
});

// This is here cause Jest complains about it
afterAll(() => {
  redisClient.disconnect();
});
