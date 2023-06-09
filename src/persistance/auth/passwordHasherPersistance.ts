import argon2 from "argon2";

export const passwordHasherPersistance = async (password: string) => {
  return await argon2.hash(password);
};
