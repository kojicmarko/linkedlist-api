import app from "./app";
import { PORT } from "./utils/config";
import * as dotenv from "dotenv";

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
