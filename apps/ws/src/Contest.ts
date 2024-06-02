import { randomUUID } from "crypto";
import { WebSocket } from "ws";
import { User } from "./SocketManager";
import { createClient, RedisClientType } from "redis";
import { connect } from "http2";
import { CODE_QUEUE, SUBMISSION_RESULT, SUBMISSION_TOKEN } from "./messages";

export class Contest {
  public id: string;
  public startTime: Date = new Date();
  public participant1: User;
  public participant2: User | undefined;
  public participant1Code: string = "";
  public participant2Code: string = "";
  public participant1Status: string = "";
  public participant2Status: string = "";
  public viewers: User[] = [];
  public problem: string;
  public redisQueue: RedisClientType;
  public redisSubscriber: RedisClientType;

  constructor(participant1: User, contestID: string, startTime?: Date) {
    this.participant1 = participant1;
    this.participant2 = undefined;
    this.id = contestID;
    this.redisQueue = createClient();
    this.redisSubscriber = createClient();
    this.problem = "";
    this.connectRedis();
  }

  async connectRedis() {
    await this.redisQueue.connect();
    await this.redisSubscriber.connect();
    await this.redisSubscriber.subscribe(this.id, (data) => {
      const message = JSON.parse(data);
      console.log(message);

      if (message.type === SUBMISSION_TOKEN) {
        const { token, participant } = message.payload;
        const user =
          this.participant1.id === participant.id
            ? this.participant1
            : this.participant2;
        user?.socket.send(
          JSON.stringify({ type: SUBMISSION_TOKEN, payload: token })
        );
      }

      if (message.type === SUBMISSION_RESULT) {
        const { stdout, participant, description } = message.payload;
        const user =
          this.participant1.id === participant.id
            ? this.participant1
            : this.participant2;
        user?.socket.send(
          JSON.stringify({
            type: SUBMISSION_RESULT,
            payload: {
              stdout,
              description,
            },
          })
        );
        this.viewers?.forEach((viewer) => {
          viewer.socket.send(
            JSON.stringify({
              type: SUBMISSION_RESULT,
              payload: {
                stdout,
                description,
                participant: {
                  id: participant.id,
                  username: participant.name,
                },
              },
            })
          );
        });
      }
    });
  }

  saveCodeProgress(user: User, code: string) {
    if (this.participant1.id === user.id) {
      this.participant1Code = code;
    } else if (this.participant2?.id === user.id) {
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
      this.participant1.id === user.id ? this.participant1 : this.participant2;

    const payload = {
      code,
      codeID,
      participant,
      contestID: this.id,
    };

    await this.redisQueue.lPush(CODE_QUEUE, JSON.stringify(payload));
  }

  broadcast(message: any, viewers: User[] = this.viewers) {
    viewers?.forEach((viewer) => {
      viewer.socket.send(JSON.stringify(message));
    });
  }
}
