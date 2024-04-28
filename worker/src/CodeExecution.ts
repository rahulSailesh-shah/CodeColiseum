import { parse } from "path";
import { postSubmission } from "./api";
import { RedisClientType, createClient } from "redis";

export class CodeExecution {
    public code: string;
    public contestId: string;
    public userId: string;
    public codeId: string;
    public status: string;
    public publisherClient: RedisClientType = createClient();

    constructor(
        code: string,
        contestId: string,
        userId: string,
        codeId: string
    ) {
        this.code = code;
        this.contestId = contestId;
        this.userId = userId;
        this.codeId = codeId;
        this.status = "";
        this.connectPublisher();
    }

    async connectPublisher() {
        await this.publisherClient.connect();
    }

    async createSubmission() {
        const base64Code = Buffer.from(this.code).toString("base64");
        const languageId = parseInt(this.codeId);
        const result = await postSubmission(base64Code, languageId);
        this.pollSubmission(result.token);
        return result;
    }

    async pollSubmission(submissionToken: string) {
        console.log("Polling for submission");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Got the result after polling");
        this.broadcastResult();
    }

    async broadcastResult() {
        console.log("Broadcasting the result");
        await this.publisherClient.publish(this.contestId, "result");
        console.log("Result broadcasted");
    }
}
