import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080);

app.use(cors());

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket) => {
    ws.on("error", console.error);
});
