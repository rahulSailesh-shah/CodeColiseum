import { Contest } from "./Contest";
import {
  CODE_CHANGE,
  INIT_CONTEST,
  JOIN_ROOM,
  CODE_SUBMIT,
  JOIN_REQUEST,
  ACCEPT_REQUEST,
  DECLINE_REQUEST,
  CONTEST_FULL,
} from "./messages";
import { User } from "./SocketManager";

export class ContestManager {
  private contests: Contest[];
  private users: User[];

  constructor() {
    this.contests = [];
    this.users = [];
  }

  addUsers(user: User) {
    console.log("New user connected");
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

  removeUser(userId: string) {
    // TODO: Logic to remove user if viewer leaves
    // TODO: Logic to remove user if participant leaves and update status
  }

  initContest(user: User, contestID: string) {
    const contest = new Contest(user, contestID);
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

  handleViewerJoinRoom(user: User, contestID: string) {
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

  handleCodeChange(user: User, code: string, contestID: string) {
    const contest = this.contests.find(
      (x) =>
        x.id === contestID &&
        (x.participant1.id === user.id || x.participant2?.id === user.id)
    );
    if (!contest) {
      console.log("Contest not found");
      return;
    }
    console.log(`[.] ${user.id} CODE: ${code}, CONTEST_ID: ${contest.id}`);
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

  handleCodeSubmit(user: User, codeID: string) {
    const contest = this.contests.find(
      (x) => x.participant1.id === user.id || x.participant2?.id === user.id
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
        this.initContest(user, message.payload.contestID);
      }

      if (message.type === JOIN_ROOM) {
        if (!message.payload.contestID) {
          console.log("Contest ID not provided");
          return;
        }
        this.handleViewerJoinRoom(user, message.payload.contestID);
      }

      if (message.type === CODE_CHANGE) {
        if (!message.payload.code && message.payload.code !== "") {
          console.log("Code not provided");
          return;
        }
        this.handleCodeChange(
          user,
          message.payload.code,
          message.payload.contestID
        );
      }

      if (message.type === CODE_SUBMIT) {
        if (!message.payload.codeID) {
          console.log("Code ID not provided");
          return;
        }
        this.handleCodeSubmit(user, message.payload.codeID);
      }

      if (message.type === JOIN_REQUEST) {
        const contestId = message.payload.contestId;
        const contest = this.contests.find(
          (contest) => contest.id === contestId
        );
        if (!contest) {
          console.log("Contest not found");
          return;
        }
        const broadcastMessage = {
          type: JOIN_REQUEST,
          payload: {
            userId: user.id,
          },
        };

        contest.broadcast(broadcastMessage, [contest.participant1]);
      }

      if (message.type === ACCEPT_REQUEST) {
        const { contestId, userId } = message.payload;
        const contest = this.contests.find(
          (contest) => contest.id === contestId
        );
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
          type: CONTEST_FULL,
          payload: {
            contestId,
          },
        };

        contest.broadcast(broadcastMessage, [
          contest.participant1,
          contest.participant2,
        ]);
      }

      if (message.type === DECLINE_REQUEST) {
        const { userId } = message.payload;
        const participant = this.users.find((user) => user.id === userId);
        if (!participant) {
          console.log("User not found");
          return;
        }
        const broadcastMessage = {
          type: DECLINE_REQUEST,
          payload: {
            message: "Request declined",
          },
        };
        participant.socket.send(JSON.stringify(broadcastMessage));
      }
    });
  }
}
