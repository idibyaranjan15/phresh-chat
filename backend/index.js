import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const app = express();
app.use(cors);
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send(`Heloo World`);
});

io.on("connection", (socket) => {
  console.log(`User connected`);
  console.log("User id", socket.id);
  socket.on("disconnect", () => {
    console.log(`User Disconnected`, socket.id);
  });
});
server.listen(3000, () => {
  console.log(`Server is running on 3000`);
});
