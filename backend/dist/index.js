"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const ContestManager_1 = require("./ContestManager");
const SocketManager_1 = require("./SocketManager");
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
app.use((0, cors_1.default)());
const wss = new ws_1.WebSocketServer({ server: httpServer });
const contestManager = new ContestManager_1.ContestManager();
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    contestManager.addUsers(new SocketManager_1.User("user", ws));
    ws.on("close", (data) => {
        contestManager.removeUser(data.toString());
    });
});
