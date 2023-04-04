import { UserEntry, UserLogin } from "../src/utils/types";

export const existingUser = {
  email: "existing@testmail.com",
  username: "existing",
  password: "existing",
};

export const validUser: UserLogin = {
  email: "existing@testmail.com",
  password: "existing",
};

export const invalidUser: UserLogin = {
  email: "existing@testmail.com",
  password: "invalid",
};

export const newUser: UserEntry = {
  email: "testing@testmail.com",
  username: "testing",
  password: "testing",
};
