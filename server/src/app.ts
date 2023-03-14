import express from "express";
import { unknownEndpoint } from "./middleware/index";
require("express-async-errors");

const app = express();

import pingRouter from "./routes/ping";

app.use(express.json());

app.use("/ping", pingRouter);

app.use(unknownEndpoint);

export default app;
