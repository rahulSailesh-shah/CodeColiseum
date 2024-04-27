import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { User } from "./SocketManager";
import { createClient, RedisClientType } from "redis";
import { connect } from "http2";
import { CODE_QUEUE } from "./messages";

export class Contest {
    public id: string;
    public startTime: Date = new Date();
    public participant1: User;
    public participant2: User;
    public participant1Code: string = "";
    public participant2Code: string = "";
    public participant1Status: string = "";
    public participant2Status: string = "";
    public viewers: User[] = [];
    public problem: string;
    public redisQueue: RedisClientType;
    public redisSubscriber: RedisClientType;

    constructor(
        participant1: User,
        participant2: User,
        startTime?: Date,
        gameId?: string
    ) {
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.id = gameId ?? randomUUID();
        this.redisQueue = createClient();
        this.redisSubscriber = createClient();
        this.problem = "";
        this.connectRedis();
    }

    async connectRedis() {
        await this.redisQueue.connect();
        await this.redisSubscriber.connect();
        await this.redisSubscriber.subscribe(this.id, (message) => {
            console.log(message);
        });
    }

    saveCodeProgress(user: User, code: string) {
        if (this.participant1.id === user.id) {
            this.participant1Code = code;
        } else if (this.participant2.id === user.id) {
            this.participant2Code = code;
        } else {
            console.log("User not in contest");
        }
    }

    async submitCode(user: User, codeID: string) {
        const code =
            this.participant1.id === user.id
                ? this.participant1Code
                : this.participant2Code;
        const participant =
            this.participant1.id === user.id ? "participant1" : "participant2";

        const payload = {
            code,
            codeID,
            participant,
            contestId: this.id,
        };

        await this.redisQueue.lPush(CODE_QUEUE, JSON.stringify(payload));
    }

    broadcast() {
        const message = {
            type: "code_change",
            payload: {
                participant1Code: this.participant1Code,
                participant2Code: this.participant2Code,
            },
        };

        this.viewers?.forEach((viewer) => {
            viewer.socket.send(JSON.stringify(message));
        });
    }
}
