import { createClient } from "redis";
import dotenv from "dotenv";
import { CodeExecution } from "./CodeExecution";

dotenv.config();

async function startWorker() {
    const queueClient = createClient();
    const subscriberClient = createClient();

    await queueClient.connect();
    await subscriberClient.connect();
    console.log("Worker Running");

    while (true) {
        const data: any = await queueClient.brPop("code_queue", 0);
        if (data) {
            const result = JSON.parse(data.element);
            console.log(result);
            const { code, codeID, participant, contestID } = result;

            const codeExecutor = new CodeExecution(
                code,
                contestID,
                participant.id,
                codeID
            );
            await codeExecutor.createSubmission();

            await subscriberClient.publish(
                contestID,
                "Code executed successfully"
            );
        }
    }
}

startWorker();
