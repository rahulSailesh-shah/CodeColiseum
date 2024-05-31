import { WebSocketServer, WebSocket } from "ws";
import { ContestManager } from "./ContestManager";
import { User } from "./SocketManager";
import url from "url";
import { extractUserId } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const contestManager = new ContestManager();

wss.on("connection", (ws: WebSocket, req: Request) => {
  ws.on("error", console.error);

  const token: string = url.parse(req.url, true).query.token as string;
  // const userId = extractUserId(token);

  contestManager.addUsers(new User("user", ws));

  ws.on("close", (data) => {
    contestManager.removeUser(data.toString());
  });
});
