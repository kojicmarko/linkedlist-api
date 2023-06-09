import { Session, SessionData } from "express-session";
import { passwordValidatorPersistance } from "../../persistance/auth/";
import { getUserByEmailInteractor } from "../users/";

export const loginUserInteractor = async (
  email: string,
  password: string,
  session: Session & Partial<SessionData>
) => {
  const user = await getUserByEmailInteractor(email);
  if (!user) {
    return undefined;
  }

  const passwordCorrect = await passwordValidatorPersistance(
    user.passwordHash,
    password
  );
  if (!(user && passwordCorrect)) {
    return undefined;
  }

  session.userId = user.id;

  return session;
};
