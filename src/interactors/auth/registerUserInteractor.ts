import { UserEntry } from "../../utils/types";
import {
  passwordHasherPersistance,
  registerUserPersistance,
} from "../../persistance/auth";

export const registerUserInteractor = async ({
  email,
  username,
  password,
}: UserEntry) => {
  const passwordHash = await passwordHasherPersistance(password);

  const newUser = {
    email,
    username,
    passwordHash,
  };

  const user = await registerUserPersistance(newUser);

  return user;
};
