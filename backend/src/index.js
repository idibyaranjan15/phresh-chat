import express from "express";
import authRoutes from "./routes/auth.route.js";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(5001, () => {
  connectDb();
  console.log(`Server is runnng on port ${5001}...`);
});
