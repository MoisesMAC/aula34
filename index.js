import http from "http";
import { WebSocketServer } from "ws";
import staticHandler from "serve-handler";

const messages = [];
const onlineUsers = {};

const server = http.createServer((request, response) => {
  return staticHandler(request, response, { public: "public" });
});
const wss = new WebSocketServer({ server });

function generateUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
}

wss.on("connection", (client) => {
  const id = generateUniqueID();

  client.on("message", (data) => {
    const { name } = JSON.parse(data.toString());
    onlineUsers[id] = name;
  });

  client.on("message", (data) => {
    messages.push(data.toString());
    broadcast(data.toString());
  });

  messages.forEach((message) => {
    client.send(message);
  });

  client.on("close", () => {
    delete onlineUsers[id];
  });

  setInterval(() => {
    client.send(
      JSON.stringify({
        onlineUsers: Object.values(onlineUsers),
      })
    );
  }, 500);
});

function broadcast(data) {
  for (const client of wss.clients) {
    client.send(data);
  }
}

server.listen(3000);
