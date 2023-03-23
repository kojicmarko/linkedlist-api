import { Session, SessionData } from "express-session";

export const logoutUserInteractor = (
  session: Session & Partial<SessionData>
) => {
  session.destroy((err) => {
    if (err) console.log(err);
  });
};
