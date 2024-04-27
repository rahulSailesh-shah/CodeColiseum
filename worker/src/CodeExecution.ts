import { parse } from "path";
import { postSubmission } from "./api";

export class CodeExecution {
    public code: string;
    public contestId: string;
    public userId: string;
    public codeId: string;
    public status: string;

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
    }

    async createSubmission() {
        const base64Code = Buffer.from(this.code).toString("base64");
        const languageId = parseInt(this.codeId);
        const result = await postSubmission(base64Code, languageId);
        return result;
    }
}
