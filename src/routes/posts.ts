import express from "express";
import {
  getAllPostsInteractor,
  createPostInteractor,
  getPostByIdInteractor,
} from "../interactors/posts";
import { PostEntry } from "../utils/types";

const router = express.Router();

router.get("/", async (_req, res) => {
  const posts = await getAllPostsInteractor();
  return res.status(200).json(posts);
});

router.get("/:id", async (req, res) => {
  const post = await getPostByIdInteractor(req.params.id);
  if (!post) {
    return res.status(404).send({ ERROR: "Unknown Endpoint" }).end();
  }
  return res.status(200).json(post);
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
