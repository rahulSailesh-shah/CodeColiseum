"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContestManager = void 0;
class ContestManager {
    constructor() {
        this.contests = [];
        this.users = [];
    }
    addUsers(user) {
        this.users.push(user);
        this.handler(user);
    }
    handler(user) {
        user.socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log(message);
        });
    }
}
exports.ContestManager = ContestManager;
