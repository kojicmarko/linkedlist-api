import express from "express";
import { registerUserInteractor } from "../interactors/auth/index";
import { UserEntry } from "../utils/types";

const router = express.Router();

router.post("/register", async (req, res) => {
  const user = await registerUserInteractor(req.body as UserEntry);
  return res.status(201).json(user);
});

export default router;
