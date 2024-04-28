import { createClient } from "redis";
import dotenv from "dotenv";
import { CodeExecution } from "./CodeExecution";

dotenv.config({ path: __dirname + "/.env" });

async function startWorker() {
    const queueClient = createClient();
    const publisherClient = createClient();

    await queueClient.connect();
    await publisherClient.connect();
    console.log("Worker Running");

    while (true) {
        const data: any = await queueClient.brPop("code_queue", 0);
        if (!data) return;

        try {
            const result = JSON.parse(data.element);
            const { code, codeID, participant, contestID } = result;

            const codeExecutor = new CodeExecution(
                code,
                contestID,
                participant.id,
                codeID
            );
            const submissionToken = await codeExecutor.createSubmission();
            await publisherClient.publish(contestID, submissionToken.token);
            console.log("Token sent");
        } catch (error) {
            console.log(error);
        }
    }
}

startWorker();
