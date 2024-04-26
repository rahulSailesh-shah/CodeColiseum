"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contest = void 0;
const crypto_1 = require("crypto");
class Contest {
    constructor(participant1, participant2, startTime, gameId) {
        this.startTime = new Date();
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.id = gameId !== null && gameId !== void 0 ? gameId : (0, crypto_1.randomUUID)();
        this.problem = "";
    }
}
exports.Contest = Contest;
