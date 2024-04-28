import { getSubmission, postSubmission } from "./api";
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

    private async connectPublisher() {
        await this.publisherClient.connect();
    }

    public async createSubmission() {
        const base64Code = Buffer.from(this.code).toString("base64");
        const languageId = parseInt(this.codeId);
        const result = await postSubmission(base64Code, languageId);
        this.pollSubmission(result.token);
        return result;
    }

    private async pollSubmission(submissionToken: string) {
        let statusID: number = 1;
        let result: any;
        while (statusID === 1 || statusID === 2) {
            result = await getSubmission(submissionToken);
            statusID = result.status.id;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log(statusID);
        }

        this.broadcastResult(result.status.description);
    }

    private async broadcastResult(description: string) {
        await this.publisherClient.publish(this.contestId, description);
    }
}
