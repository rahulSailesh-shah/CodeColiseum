import { randomUUID } from "crypto";
import { WebSocket } from "ws";

export class User {
    public id: string;
    public name: string;
    public socket: WebSocket;

    constructor(name: string, socket: WebSocket) {
        this.name = name;
        this.socket = socket;
        this.id = randomUUID();
    }
}
