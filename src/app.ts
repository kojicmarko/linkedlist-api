import express from "express";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { unknownEndpoint } from "./middleware/index";
import { COOKIE_NAME, REDIS_URL, SECRET } from "./utils/config";
// TODO: deal with that:
require("express-async-errors");

const app = express();

const RedisStore = connectRedis(session);
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
import authRouter from "./routes/auth";

app.use(express.json());

app.use("/ping", pingRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth/", authRouter);

app.use(unknownEndpoint);

export default app;
