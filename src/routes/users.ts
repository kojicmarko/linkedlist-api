import express from "express";
import {
  getAllUsersInteractor,
  getUserByIdInteractor,
} from "../interactors/users";

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

export default router;
