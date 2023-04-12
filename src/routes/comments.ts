import express from "express";
import {
  createCommentInteractor,
  deleteCommentInteractor,
  getAllCommentsInteractor,
  getCommentByIdInteractor,
  updateCommentInteractor,
} from "../interactors/comments";
import { CommentEntry, Err, UpdateCommentEntry } from "../utils/types";

const router = express.Router();

router.get("/:id/comments", async (_req, res) => {
  const comments = await getAllCommentsInteractor();
  return res.status(200).json(comments);
});

router.get("/:id/comments/:id", async (req, res) => {
  const comment = await getCommentByIdInteractor(req.params.id);
  if (!comment) {
    return res.status(404).send({ ERROR: "Unknown Endpoint" }).end();
  }
  return res.status(200).json(comment);
});

router.post("/:id/comments", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const comment = await createCommentInteractor(
    req.session.userId,
    req.params.id,
    req.body as CommentEntry
  );

  if ((comment as Err).ERROR !== undefined) {
    return res.status(400).json(comment);
  }

  return res.status(201).json(comment);
});

router.put("/:id/comments/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const { content } = req.body as UpdateCommentEntry;

  const comment = await updateCommentInteractor(req.session.userId, {
    id: req.params.id,
    content,
  });

  if ((comment as Err).ERROR !== undefined) {
    return res.status(400).json(comment);
  }

  return res.status(200).json(comment);
});

router.delete("/:id/comments/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ ERROR: "Unauthorized!" }).end();
  }

  const err = await deleteCommentInteractor(req.session.userId, req.params.id);

  if ((err as Err).ERROR !== undefined) {
    return res.status(400).json(err);
  }

  return res.status(204).end();
});

export default router;
