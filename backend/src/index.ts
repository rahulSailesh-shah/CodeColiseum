import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { ContestManager } from "./ContestManager";
import { User } from "./SocketManager";

const app = express();
const httpServer = app.listen(8080);

app.use(cors());

const wss = new WebSocketServer({ server: httpServer });

const contestManager = new ContestManager();

wss.on("connection", (ws: WebSocket) => {
    ws.on("error", console.error);
    contestManager.addUsers(new User("user", ws));
});
