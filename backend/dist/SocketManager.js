"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
        this.id = (0, crypto_1.randomUUID)();
    }
}
exports.User = User;
