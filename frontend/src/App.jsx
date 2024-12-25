import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && room.trim() && message.trim()) {
      socket.emit("message", { message, room });
      setMessage("");
    }
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);

    setRoomName("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log(`Connected: ${socket.id}`);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
        {/* Header Section */}
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Socket.io Chat App
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Socket ID: <strong>{socketId}</strong>
        </Typography>
        <Divider style={{ margin: "20px 0" }} />

        <form onSubmit={joinRoomHandler}>
          <h5>Join Rrom</h5>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            label="Room Name"
            variant="outlined"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Join
          </Button>
        </form>

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            label="Room"
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Message"
            variant="outlined"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Message
          </Button>
        </Box>

        <Divider style={{ margin: "20px 0" }} />

        {/* Messages Section */}
        <Typography variant="h6" gutterBottom color="secondary">
          Messages
        </Typography>
        <List
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            padding: 2,
          }}
        >
          {messages.length > 0 ? (
            messages.map((item, index) => (
              <ListItem key={index} sx={{ marginBottom: 1 }}>
                <ListItemText
                  primary={item.message || "No message"}
                  secondary={`Room: ${item.room || "N/A"}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No messages yet. Join a room and send a message!
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default App;
