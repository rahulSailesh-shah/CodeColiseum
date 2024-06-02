import { WebSocketServer, WebSocket } from "ws";
import { ContestManager } from "./ContestManager";
import { User, UserType } from "./SocketManager";
import url from "url";
import { extractUserId } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const contestManager = new ContestManager();

wss.on("connection", async (ws: WebSocket, req: Request) => {
  ws.on("error", console.error);

  const { userToken } = url.parse(req.url, true).query;

  const user = await extractUserId(userToken as string);

  if (!user) {
    ws.close();
    return;
  }

  const newUser: UserType = {
    id: user.id,
    name: user.name,
    socket: ws,
  };

  contestManager.addUsers(new User(newUser));

  ws.on("close", (data) => {
    contestManager.removeUser(data.toString());
  });
});
