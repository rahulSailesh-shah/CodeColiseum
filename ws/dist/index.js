"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const ContestManager_1 = require("./ContestManager");
const SocketManager_1 = require("./SocketManager");
const url_1 = __importDefault(require("url"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const contestManager = new ContestManager_1.ContestManager();
wss.on("connection", (ws, req) => {
    ws.on("error", console.error);
    const token = url_1.default.parse(req.url, true).query.token;
    console.log(token);
    contestManager.addUsers(new SocketManager_1.User("user", ws));
    ws.on("close", (data) => {
        contestManager.removeUser(data.toString());
    });
});
