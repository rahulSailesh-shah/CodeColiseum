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
exports.ContestManager = void 0;
const Contest_1 = require("./Contest");
const messages_1 = require("./messages");
class ContestManager {
    constructor() {
        this.pendingUser = null;
        this.contests = [];
        this.users = [];
    }
    addUsers(user) {
        this.users.push(user);
        const broadcastMessage = {
            type: "user_joined",
            payload: {
                userId: user.id,
            },
        };
        user.socket.send(JSON.stringify(broadcastMessage));
        this.handler(user);
    }
    removeUser(userId) {
        // TODO: Logic to remove user if viewer leaves
        // TODO: Logic to remove user if participant leaves and update status
    }
    initContest(user) {
        const contest = new Contest_1.Contest(user);
        this.contests.push(contest);
        console.log("NEW CONTEST\n", contest.id);
        const message = {
            type: "room_created",
            payload: {
                contestID: contest.id,
            },
        };
        contest.broadcast(message, [user]);
    }
    handleViewerJoinRoom(user, contestID) {
        const contest = this.contests.find((contest) => contest.id === contestID);
        if (!contest) {
            console.log("Contest not found");
            return;
        }
        contest.viewers.find((x) => x.id === user.id)
            ? console.log("You're already a viewer")
            : contest.viewers.push(user);
        const broadcastMessage = {
            type: "code_change",
            payload: {
                participant1Code: contest.participant1Code,
                participant2Code: contest.participant2Code,
            },
        };
        contest.broadcast(broadcastMessage, contest.viewers);
        console.log(contest.viewers.length, " viewers");
    }
    handleCodeChange(user, code) {
        const contest = this.contests.find((x) => { var _a; return x.participant1.id === user.id || ((_a = x.participant2) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
        if (!contest) {
            console.log("Contest not found");
            return;
        }
        console.log(`[.] ${user.id} changed code: ${code}`);
        contest.saveCodeProgress(user, code);
        const broadcastMessage = {
            type: "code_change",
            payload: {
                participant1Code: contest.participant1Code,
                participant2Code: contest.participant2Code,
            },
        };
        contest.broadcast(broadcastMessage, contest.viewers);
    }
    handleCodeSubmit(user, codeID) {
        const contest = this.contests.find((x) => { var _a; return x.participant1.id === user.id || ((_a = x.participant2) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
        if (!contest) {
            console.log("You are not in a contest");
            return;
        }
        contest.submitCode(user, codeID);
    }
    handler(user) {
        user.socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_CONTEST) {
                this.initContest(user);
            }
            if (message.type === messages_1.JOIN_ROOM) {
                if (!message.payload.contestID) {
                    console.log("Contest ID not provided");
                    return;
                }
                this.handleViewerJoinRoom(user, message.payload.contestID);
            }
            if (message.type === messages_1.CODE_CHANGE) {
                if (!message.payload.code && message.payload.code !== "") {
                    console.log("Code not provided");
                    return;
                }
                this.handleCodeChange(user, message.payload.code);
            }
            if (message.type === messages_1.CODE_SUBMIT) {
                if (!message.payload.codeID) {
                    console.log("Code ID not provided");
                    return;
                }
                this.handleCodeSubmit(user, message.payload.codeID);
            }
            if (message.type === messages_1.JOIN_REQUEST) {
                const contestId = message.payload.contestId;
                const contest = this.contests.find((contest) => contest.id === contestId);
                if (!contest) {
                    console.log("Contest not found");
                    return;
                }
                const broadcastMessage = {
                    type: messages_1.JOIN_REQUEST,
                    payload: {
                        userId: user.id,
                    },
                };
                contest.broadcast(broadcastMessage, [contest.participant1]);
            }
            if (message.type === messages_1.ACCEPT_REQUEST) {
                const { contestId, userId } = message.payload;
                const contest = this.contests.find((contest) => contest.id === contestId);
                if (!contest) {
                    console.log("Contest not found");
                    return;
                }
                if (contest.participant2 && contest.participant1) {
                    console.log("Contest is full");
                    return;
                }
                const participant2 = this.users.find((user) => user.id === userId);
                if (!participant2) {
                    console.log("User not found");
                    return;
                }
                contest.participant2 = participant2;
                const broadcastMessage = {
                    type: messages_1.CONTEST_FULL,
                    payload: {
                        contestId,
                    },
                };
                contest.broadcast(broadcastMessage, [
                    contest.participant1,
                    contest.participant2,
                ]);
            }
        }));
    }
}
exports.ContestManager = ContestManager;
