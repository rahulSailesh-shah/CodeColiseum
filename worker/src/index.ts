import { createClient } from "redis";

async function startWorker() {
    const queueClient = createClient();
    const subscriberClient = createClient();

    await queueClient.connect();
    await subscriberClient.connect();
    console.log("Worker Running");

    while (true) {
        const data: any = await queueClient.brPop("code_queue", 0);
        if (data) {
            console.log("Received Submission", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const result = JSON.parse(data.element);
            await subscriberClient.publish(
                result.contestId,
                "Code executed successfully"
            );
        }
    }
}

startWorker();
