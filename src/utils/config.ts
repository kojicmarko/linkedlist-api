import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL as string;
export const PORT = process.env.PORT || 3001;
export const SECRET = process.env.SECRET as string;
export const COOKIE_NAME = "sid";
