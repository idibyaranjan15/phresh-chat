import React, { useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = io("http://localhost:3000");
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected`, socket.id);
    });

    socket.on("welcome", (socket) => {
      console.log(socket);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>App</div>;
};

export default App;
