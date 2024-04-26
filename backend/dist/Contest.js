"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contest = void 0;
const crypto_1 = require("crypto");
class Contest {
    constructor(participant1, participant2, startTime, gameId) {
        this.startTime = new Date();
        this.participant1Code = "";
        this.participant2Code = "";
        this.participant1Status = "";
        this.participant2Status = "";
        this.viewers = [];
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.id = gameId !== null && gameId !== void 0 ? gameId : (0, crypto_1.randomUUID)();
        this.problem = "";
    }
    saveCodeProgress(user, code) {
        if (this.participant1.id === user.id) {
            this.participant1Code = code;
        }
        else if (this.participant2.id === user.id) {
            this.participant2Code = code;
        }
        else {
            console.log("User not in contest");
        }
    }
    submitCode(user, codeID) {
        const code = this.participant1.id === user.id
            ? this.participant1Code
            : this.participant2Code;
        const participant = this.participant1.id === user.id ? "participant1" : "participant2";
        console.log(codeID, code, participant);
    }
    broadcast() {
        var _a;
        const message = {
            type: "code_change",
            payload: {
                participant1Code: this.participant1Code,
                participant2Code: this.participant2Code,
            },
        };
        (_a = this.viewers) === null || _a === void 0 ? void 0 : _a.forEach((viewer) => {
            viewer.socket.send(JSON.stringify(message));
        });
    }
}
exports.Contest = Contest;
