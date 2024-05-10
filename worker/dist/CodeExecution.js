"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeExecution = void 0;
const api_1 = require("./api");
const redis_1 = require("redis");
const messages_1 = require("./messages");
class CodeExecution {
    constructor(code, contestId, particpant, codeId) {
        this.publisherClient = (0, redis_1.createClient)();
        this.code = code;
        this.contestId = contestId;
        this.particpant = particpant;
        this.codeId = codeId;
        this.status = "";
        this.connectPublisher();
    }
    connectPublisher() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.publisherClient.connect();
        });
    }
    createSubmission() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const base64Code = Buffer.from(this.code).toString("base64");
                const languageId = parseInt(this.codeId);
                const result = yield (0, api_1.postSubmission)(base64Code, languageId);
                this.pollSubmission(result.token);
                return result;
            }
            catch (error) {
                console.log("CREATE SUBMISSION ERROR: ", error);
                return "Error creating submission.";
            }
        });
    }
    pollSubmission(submissionToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let statusID = 1;
                let result;
                while (statusID === 1 || statusID === 2) {
                    result = yield (0, api_1.getSubmission)(submissionToken);
                    statusID = result.status.id;
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
                }
                this.broadcastResult(result);
            }
            catch (error) {
                console.log("POLL SUBMISSION ERROR: ", error);
            }
        });
    }
    broadcastResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const output = result.stdout
                    ? Buffer.from(result.stdout, "base64").toString("utf-8")
                    : result.stderr
                        ? Buffer.from(result.stderr, "base64").toString("utf-8")
                        : "Error fetching output.";
                const message = {
                    type: messages_1.SUBMISSION_RESULT,
                    payload: {
                        stdout: output,
                        participant: this.particpant,
                        description: result.status.description,
                    },
                };
                yield this.publisherClient.publish(this.contestId, JSON.stringify(message));
            }
            catch (error) {
                console.log("BROADCAST RESULT ERROR: ", error);
            }
        });
    }
}
exports.CodeExecution = CodeExecution;
