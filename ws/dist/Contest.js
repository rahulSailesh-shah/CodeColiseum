"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contest = void 0;
const crypto_1 = require("crypto");
const redis_1 = require("redis");
const messages_1 = require("./messages");
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
        this.redisQueue = (0, redis_1.createClient)();
        this.redisSubscriber = (0, redis_1.createClient)();
        this.problem = "";
        this.connectRedis();
    }
    connectRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisQueue.connect();
            yield this.redisSubscriber.connect();
            yield this.redisSubscriber.subscribe(this.id, (data) => {
                var _a;
                const message = JSON.parse(data);
                console.log(message);
                if (message.type === messages_1.SUBMISSION_TOKEN) {
                    const { token, participant } = message.payload;
                    const user = this.participant1.id === participant.id
                        ? this.participant1
                        : this.participant2;
                    user.socket.send(JSON.stringify({ type: messages_1.SUBMISSION_TOKEN, payload: token }));
                }
                if (message.type === messages_1.SUBMISSION_RESULT) {
                    const { stdout, participant, description } = message.payload;
                    const user = this.participant1.id === participant.id
                        ? this.participant1
                        : this.participant2;
                    user.socket.send(JSON.stringify({
                        type: messages_1.SUBMISSION_RESULT,
                        payload: {
                            stdout,
                            description,
                        },
                    }));
                    (_a = this.viewers) === null || _a === void 0 ? void 0 : _a.forEach((viewer) => {
                        viewer.socket.send(JSON.stringify({
                            type: messages_1.SUBMISSION_RESULT,
                            payload: {
                                stdout,
                                description,
                                participant: {
                                    id: participant.id,
                                    username: participant.name,
                                },
                            },
                        }));
                    });
                }
            });
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            const code = this.participant1.id === user.id
                ? this.participant1Code
                : this.participant2Code;
            const participant = this.participant1.id === user.id
                ? this.participant1
                : this.participant2;
            const payload = {
                code,
                codeID,
                participant,
                contestID: this.id,
            };
            yield this.redisQueue.lPush(messages_1.CODE_QUEUE, JSON.stringify(payload));
        });
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
