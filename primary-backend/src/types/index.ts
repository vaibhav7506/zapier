import express from "express";
import { userRouter } from "../router/user";
import { zapRouter } from "../router/zap";
import cors from "cors";
import { triggerRouter } from "../router/trigger";
import { actionRouter } from "../router/action";

const app = express();
app.use(express.json());
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  FRONTEND_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});