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
        this.handler(user);
    }
    removeUser(userId) {
        // TODO: Logic to remove user if viewer
        // TODO: Logic to remove user if participant and update status
    }
    initContest(user) {
        if (this.pendingUser) {
            if (this.pendingUser.id === user.id) {
                console.log("You can't play against yourself");
                return;
            }
            const contest = new Contest_1.Contest(this.pendingUser, user);
            this.contests.push(contest);
            this.pendingUser = null;
            console.log("NEW CONTEST", contest.id);
        }
        else {
            console.log("Player 1 waiting");
            this.pendingUser = user;
        }
    }
    handleJoinRoom(user, contestId) {
        const contest = this.contests.find((contest) => contest.id === contestId);
        if (!contest) {
            console.log("Contest not found");
            return;
        }
        contest.viewers.find((x) => x.id === user.id)
            ? console.log("You're already a viewer")
            : contest.viewers.push(user);
        contest.broadcast();
        console.log(contest.viewers.length, " viewers");
    }
    handleCodeChange(user, code) {
        const contest = this.contests.find((x) => x.participant1.id === user.id || x.participant2.id === user.id);
        if (!contest) {
            console.log("Contest not found");
            return;
        }
        contest.saveCodeProgress(user, code);
        contest.broadcast();
    }
    handleCodeSubmit(user, codeID) {
        const contest = this.contests.find((x) => x.participant1.id === user.id || x.participant2.id === user.id);
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
                if (!message.payload.contestId) {
                    console.log("Contest ID not provided");
                    return;
                }
                this.handleJoinRoom(user, message.payload.contestId);
            }
            if (message.type === messages_1.CODE_CHANGE) {
                if (!message.payload.code) {
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
        }));
    }
}
exports.ContestManager = ContestManager;
