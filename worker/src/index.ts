import { createClient } from "redis";
import dotenv from "dotenv";
import { CodeExecution } from "./CodeExecution";
import { CODE_QUEUE, SUBMISSION_TOKEN } from "./messages";

dotenv.config({ path: __dirname + "/.env" });

async function startWorker() {
    const queueClient = createClient();
    const publisherClient = createClient();

    await queueClient.connect();
    await publisherClient.connect();
    console.log("Worker Running");

    while (true) {
        const data: any = await queueClient.brPop(CODE_QUEUE, 0);
        if (!data) return;

        try {
            const result = JSON.parse(data.element);
            const { code, codeID, participant, contestID } = result;

            const codeExecutor = new CodeExecution(
                code,
                contestID,
                participant,
                codeID
            );
            const submissionToken = await codeExecutor.createSubmission();
            const message = {
                type: SUBMISSION_TOKEN,
                payload: {
                    token: submissionToken.token,
                    participant,
                },
            };
            await publisherClient.publish(contestID, JSON.stringify(message));
        } catch (error) {
            console.log(error);
        }
    }
}

startWorker();
