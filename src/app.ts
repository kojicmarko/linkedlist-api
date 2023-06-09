import express from "express";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { unknownEndpoint } from "./middleware/";
import { COOKIE_NAME, REDIS_URL, SECRET } from "./utils/config";
import * as dotenv from "dotenv";
// TODO: Deal with that
require("express-async-errors");

dotenv.config();

const app = express();

const RedisStore = connectRedis(session);

// Exported for Jest
export const redisClient = new Redis(REDIS_URL);

app.use(
  session({
    name: COOKIE_NAME,
    store: new RedisStore({ client: redisClient }),
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

import pingRouter from "./routes/ping";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import authRouter from "./routes/auth";

app.use(express.json());

app.use("/ping", pingRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/posts", commentsRouter);
app.use("/api/auth/", authRouter);

app.use(unknownEndpoint);

export default app;
