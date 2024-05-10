import { stdout } from "process";
import { getSubmission, postSubmission } from "./api";
import { RedisClientType, createClient } from "redis";
import { SUBMISSION_RESULT } from "./messages";

interface User {
    id: string;
    name: string;
    socket: WebSocket;
}

export class CodeExecution {
    public code: string;
    public contestId: string;
    public particpant: User;
    public codeId: string;
    public status: string;
    public publisherClient: RedisClientType = createClient();

    constructor(
        code: string,
        contestId: string,
        particpant: User,
        codeId: string
    ) {
        this.code = code;
        this.contestId = contestId;
        this.particpant = particpant;
        this.codeId = codeId;
        this.status = "";
        this.connectPublisher();
    }

    private async connectPublisher() {
        await this.publisherClient.connect();
    }

    public async createSubmission() {
        try {
            const base64Code = Buffer.from(this.code).toString("base64");
            const languageId = parseInt(this.codeId);
            const result = await postSubmission(base64Code, languageId);
            this.pollSubmission(result.token);
            return result;
        } catch (error) {
            console.log("CREATE SUBMISSION ERROR: ", error);
            return "Error creating submission.";
        }
    }

    private async pollSubmission(submissionToken: string) {
        try {
            let statusID: number = 1;
            let result: any;
            while (statusID === 1 || statusID === 2) {
                result = await getSubmission(submissionToken);
                statusID = result.status.id;
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            this.broadcastResult(result);
        } catch (error) {
            console.log("POLL SUBMISSION ERROR: ", error);
        }
    }

    private async broadcastResult(result: any) {
        try {
            const output = result.stdout
                ? Buffer.from(result.stdout, "base64").toString("utf-8")
                : result.stderr
                ? Buffer.from(result.stderr, "base64").toString("utf-8")
                : "Error fetching output.";
            const message = {
                type: SUBMISSION_RESULT,
                payload: {
                    stdout: output,
                    participant: this.particpant,
                    description: result.status.description,
                },
            };
            await this.publisherClient.publish(
                this.contestId,
                JSON.stringify(message)
            );
        } catch (error) {
            console.log("BROADCAST RESULT ERROR: ", error);
        }
    }
}
