import { UserEntry } from "../../utils/types";
import {
  passwordHasherPersistance,
  registerUserPersistance,
} from "../../persistance/auth";
import {
  getUserByEmailInteractor,
  getUserByUsernameInteractor,
} from "../users";

export const registerUserInteractor = async ({
  email,
  username,
  password,
}: UserEntry) => {
  const existingUserByEmail = await getUserByEmailInteractor(email);
  const exisintUserByUsername = await getUserByUsernameInteractor(username);

  if (existingUserByEmail || exisintUserByUsername) {
    return { ERROR: "User Already Exists" };
  }

  if (username.length < 4 || username.length > 16) {
    return { ERROR: "Username must be between 4 and 16 characters" };
  }

  if (password.length < 6) {
    return { ERROR: "Password must be minimum 6 characters" };
  }

  const passwordHash = await passwordHasherPersistance(password);

  const newUser = {
    email,
    username,
    passwordHash,
  };

  const user = await registerUserPersistance(newUser);

  return user;
};
