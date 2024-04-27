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
const redis_1 = require("redis");
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        const queueClient = (0, redis_1.createClient)();
        const subscriberClient = (0, redis_1.createClient)();
        yield queueClient.connect();
        yield subscriberClient.connect();
        console.log("Worker Running");
        while (true) {
            const data = yield queueClient.brPop("code_queue", 0);
            if (data) {
                console.log("Received Submission", data);
                yield new Promise((resolve) => setTimeout(resolve, 2000));
                const result = JSON.parse(data.element);
                yield subscriberClient.publish(result.contestId, "Code executed successfully");
            }
        }
    });
}
startWorker();
