import { Contest } from "./Contest";
import { CODE_CHANGE, INIT_CONTEST, JOIN_ROOM, CODE_SUBMIT } from "./messages";
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

    removeUser(userId: string) {
        // TODO: Logic to remove user if viewer
        // TODO: Logic to remove user if participant and update status
    }

    initContest(user: User) {
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

    handleJoinRoom(user: User, contestID: string) {
        const contest = this.contests.find(
            (contest) => contest.id === contestID
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

    handleCodeChange(user: User, code: string) {
        const contest = this.contests.find(
            (x) =>
                x.participant1.id === user.id || x.participant2.id === user.id
        );
        if (!contest) {
            console.log("Contest not found");
            return;
        }
        contest.saveCodeProgress(user, code);
        contest.broadcast();
    }

    handleCodeSubmit(user: User, codeID: string) {
        const contest = this.contests.find(
            (x) =>
                x.participant1.id === user.id || x.participant2.id === user.id
        );
        if (!contest) {
            console.log("You are not in a contest");
            return;
        }

        contest.submitCode(user, codeID);
    }

    handler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_CONTEST) {
                this.initContest(user);
            }

            if (message.type === JOIN_ROOM) {
                if (!message.payload.contestID) {
                    console.log("Contest ID not provided");
                    return;
                }
                this.handleJoinRoom(user, message.payload.contestID);
            }

            if (message.type === CODE_CHANGE) {
                if (!message.payload.code) {
                    console.log("Code not provided");
                    return;
                }
                this.handleCodeChange(user, message.payload.code);
            }

            if (message.type === CODE_SUBMIT) {
                if (!message.payload.codeID) {
                    console.log("Code ID not provided");
                    return;
                }
                this.handleCodeSubmit(user, message.payload.codeID);
            }
        });
    }
}
