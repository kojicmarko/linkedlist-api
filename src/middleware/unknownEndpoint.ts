import { Request, Response } from "express";

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ ERROR: "Unknown Endpoint" });
};
