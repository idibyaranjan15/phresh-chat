import express from "express";
import authRoutes from "./routes/auth.route.js";
import connectDb from "./db/connectDb.js";
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(5001, () => {
  connectDb();
  console.log(`Server is runnng on port ${5001}...`);
});
