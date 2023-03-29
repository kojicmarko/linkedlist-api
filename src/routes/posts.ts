import express from "express";
import {
  getAllPostsInteractor,
  createPostInteractor,
} from "../interactors/posts";
import { PostEntry } from "../utils/types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const posts = await getAllPostsInteractor();
  return res.status(200).json(posts);
});

router.post("/", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const post = await createPostInteractor(
    req.session.userId,
    req.body as PostEntry
  );
  return res.status(201).json(post);
});

export default router;
