import argon2 from "argon2";

export const passwordValidatorPersistance = async (
  passwordHash: string,
  password: string
) => {
  return await argon2.verify(passwordHash, password);
};
