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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const CodeExecution_1 = require("./CodeExecution");
dotenv_1.default.config({ path: __dirname + "/.env" });
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        const queueClient = (0, redis_1.createClient)();
        const publisherClient = (0, redis_1.createClient)();
        yield queueClient.connect();
        yield publisherClient.connect();
        console.log("Worker Running");
        while (true) {
            const data = yield queueClient.brPop("code_queue", 0);
            if (!data)
                return;
            try {
                const result = JSON.parse(data.element);
                const { code, codeID, participant, contestID } = result;
                const codeExecutor = new CodeExecution_1.CodeExecution(code, contestID, participant.id, codeID);
                const submissionToken = yield codeExecutor.createSubmission();
                yield publisherClient.publish(contestID, submissionToken.token);
                console.log("Token sent");
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
startWorker();
