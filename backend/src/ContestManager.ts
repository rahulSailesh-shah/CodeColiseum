import { Contest } from "./Contest";
import { CODE_CHANGE, INIT_CONTEST, JOIN_ROOM } from "./messages";
import { User } from "./SocketManager";

export class ContestManager {
    private contests: Contest[];
    private users: User[];
    private pendingUser: User | null = null;

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

            if (message.type === INIT_CONTEST) {
                if (this.pendingUser) {
                    if (this.pendingUser.id === user.id) {
                        console.log("You can't play against yourself");
                        return;
                    }

                    const contest = new Contest(this.pendingUser, user);
                    this.contests.push(contest);
                    this.pendingUser = null;
                    console.log("NEW CONTEST", contest.id);
                } else {
                    console.log("Player 1 waiting");
                    this.pendingUser = user;
                }
            }

            if (message.type === JOIN_ROOM) {
                const contestId = message.payload;
                const contest = this.contests.find(
                    (contest) => contest.id === contestId
                );
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

            if (message.type === CODE_CHANGE) {
                const contest = this.contests.find(
                    (x) =>
                        x.participant1.id === user.id ||
                        x.participant2.id === user.id
                );
                if (!contest) {
                    console.log("Contest not found");
                    return;
                }
                contest.saveCodeProgress(user, message.payload);
                contest.broadcast();
            }
        });
    }
}
