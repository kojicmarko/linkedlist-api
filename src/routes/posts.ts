import express from "express";
import {
  getAllPostsInteractor,
  createPostInteractor,
  getPostByIdInteractor,
  updatePostInteractor,
  deletePostInteractor,
} from "../interactors/posts";
import { Err, PostEntry, UpdatePostEntry } from "../utils/types";

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

  if ((post as Err).ERROR !== undefined) {
    return res.status(400).json(post);
  }

  return res.status(201).json(post);
});

router.put("/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const { content } = req.body as UpdatePostEntry;

  const post = await updatePostInteractor(req.session.userId, {
    id: req.params.id,
    content,
  });

  if ((post as Err).ERROR !== undefined) {
    return res.status(400).json(post);
  }

  return res.status(200).json(post);
});

router.delete("/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const err = await deletePostInteractor(req.session.userId, req.params.id);
  console.log(err);

  if ((err as Err).ERROR !== undefined) {
    return res.status(400).json(err);
  }

  return res.status(204).end();
});

export default router;
