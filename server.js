const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  let username;

  socket.on("newuser", function(newUser) {
    username = newUser;
    const joinedMessage = `${newUser} joined the conversation`;
    socket.broadcast.emit("user joined", { sender: username, text: joinedMessage });
  });
  socket.on("exituser", function() {
    if (username) {
      io.emit("user left", { sender: "System", text: `${username} left the conversation` });
    }
  });

  socket.on("chat", function(message) {
    if (username) {
      io.emit("chat", message);
    }
  });

  socket.on("disconnect", function() {
    if (username) {
      io.emit("user left", { sender: "System", text: `${username} left the conversation` });
    }
  });

  socket.on("error", function(err) {
    console.error("Socket error:", err);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
