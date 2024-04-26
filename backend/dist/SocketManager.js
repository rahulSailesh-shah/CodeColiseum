"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
        this.id = (0, crypto_1.randomUUID)();
    }
}
exports.User = User;
class SocketManager {
    constructor() {
        this.interestedUsers = new Map();
        this.userRoomMappping = new Map();
    }
    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }
    addUserToRoom(roomId, user) {
        var _a;
        if (!this.interestedUsers.has(roomId)) {
            this.interestedUsers.set(roomId, []);
        }
        (_a = this.interestedUsers.get(roomId)) === null || _a === void 0 ? void 0 : _a.push(user);
        this.userRoomMappping.set(user.id, roomId);
    }
    broadcast(roomId, message) {
        var _a;
        (_a = this.interestedUsers.get(roomId)) === null || _a === void 0 ? void 0 : _a.forEach((user) => {
            user.socket.send(message);
        });
    }
    removeUser(user) {
        var _a;
        const roomId = this.userRoomMappping.get(user.id);
        if (!roomId) {
            return;
        }
        const users = this.interestedUsers.get(roomId);
        if (!users) {
            return;
        }
        this.interestedUsers.set(roomId, users.filter((x) => x.id !== user.id));
        if (((_a = this.interestedUsers.get(roomId)) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            this.interestedUsers.delete(roomId);
        }
        this.userRoomMappping.delete(user.id);
    }
}
exports.SocketManager = SocketManager;
