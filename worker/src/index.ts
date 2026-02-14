require('dotenv').config();
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import express from 'express'; // Added for Render health check
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "zap-runs"; // Match the topic name from your Processor

// Kafka Setup with Aiven SSL
const kafka = new Kafka({
    clientId: 'zap-worker-main',
    brokers: [process.env.KAFKA_BROKER || ""],
    ssl: {
        rejectUnauthorized: false,
        ca: [process.env.KAFKA_CA_CERT || ""],
        key: process.env.KAFKA_KEY_CERT || "",
        cert: process.env.KAFKA_SERVICE_CERT || "",
    },
});

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker-group' });
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    console.log("Worker connected to Aiven Kafka");

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });

            if (!message.value?.toString()) return;

            const parsedValue = JSON.parse(message.value.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage || 0; // Default to 0 if not provided

            const zapRunDetails = await prismaClient.zapRun.findFirst({
                where: { id: zapRunId },
                include: {
                    zap: {
                        include: {
                            actions: { include: { type: true } }
                        }
                    },
                }
            });

            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

            if (!currentAction) {
                console.log("Current action not found?");
                return;
            }

            const zapRunMetadata = zapRunDetails?.metadata;

            // Handle Email Action
            if (currentAction.type.id === "email") {
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                console.log(`Sending email to ${to}`);
                await sendEmail(to, body);
            }

            // Handle Solana Action
            if (currentAction.type.id === "send-sol") {
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                console.log(`Sending ${amount} SOL to ${address}`);
                await sendSol(address, amount);
            }
            
            await new Promise(r => setTimeout(r, 500));

            const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
            
            if (lastStage !== stage) {
                console.log("Pushing next stage back to the queue");
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId
                        })
                    }]
                });
            }

            console.log("Processing done");
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition,
                offset: (parseInt(message.offset) + 1).toString()
            }]);
        },
    });
}

// Render Health Check Server
const app = express();
const PORT = process.env.PORT || 3004; // Changed from 3000 to 3004

app.get('/', (req, res) => res.send('Worker is healthy and consuming messages!'));

app.listen(PORT, () => {
    console.log(`Health check server listening on port ${PORT}`);
    main().catch(err => console.error("Worker Error:", err));
});