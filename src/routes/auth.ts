import express from "express";
import {
  loginUserInteractor,
  registerUserInteractor,
} from "../interactors/auth";
import { logoutUserInteractor } from "../interactors/auth/logoutUserInteractor";
import { COOKIE_NAME } from "../utils/config";
import { Err, UserEntry, UserLogin } from "../utils/types";

const router = express.Router();

router.post("/register", async (req, res) => {
  // Maybe there is a better way to deal with "req.body as UserEntry"?
  const user = await registerUserInteractor(req.body as UserEntry);

  if ((user as Err).ERROR !== undefined) {
    return res.status(400).json(user);
  }

  return res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  // Maybe there is a better way to deal with "req.body as UserLogin"?
  const { email, password } = req.body as UserLogin;
  const session = await loginUserInteractor(email, password, req.session);
  if (!session) {
    return res.status(401).send({ ERROR: "Invalid Credentials" });
  }
  return res.status(200).send(session);
});

router.delete("/logout", (req, res) => {
  logoutUserInteractor(req.session);
  res.status(204).clearCookie(COOKIE_NAME).end();
});

export default router;
