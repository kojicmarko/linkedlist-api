import express from "express";
import {
  getAllUsersInteractor,
  getUserInteractor,
} from "../interactors/users/index";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await getAllUsersInteractor();
  return res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const user = await getUserInteractor(req.params.id);
  if (!user) {
    return res.status(404).end();
  }
  return res.status(200).json(user);
});

export default router;
