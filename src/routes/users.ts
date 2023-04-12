import express from "express";
import {
  deleteUserInteractor,
  getAllUsersInteractor,
  getUserByIdInteractor,
} from "../interactors/users";
import { Err } from "../utils/types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await getAllUsersInteractor();
  return res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const user = await getUserByIdInteractor(req.params.id);
  if (!user) {
    return res.status(404).send({ ERROR: "Unknown Endpoint" }).end();
  }
  return res.status(200).json(user);
});

router.delete("/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const err = await deleteUserInteractor(req.session.userId, req.params.id);

  if ((err as Err).ERROR !== undefined) {
    return res.status(400).json(err);
  }

  return res.status(204).end();
});

export default router;
