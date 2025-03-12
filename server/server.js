const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

// Khi client kết nối
wss.on("connection", (ws) => {
  console.log("📡 Client connected");
  clients.add(ws);

  ws.on("message", (message) => {
    console.log(`📤đã nhận thông báo: ${message}`);
    const data = JSON.parse(message.toString());
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients.delete(ws);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
