import { Contest } from "./Contest";
import { User } from "./SocketManager";

export class ContestManager {
    private contests: Contest[];
    private users: User[];

    constructor() {
        this.contests = [];
        this.users = [];
    }

    addUsers(user: User) {
        this.users.push(user);
        this.handler(user);
    }

    handler(user: User) {
        user.socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log(message);
        });
    }
}
