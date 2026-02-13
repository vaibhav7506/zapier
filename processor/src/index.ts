
import { PrismaClient } from "@prisma/client";


import { Kafka } from "kafkajs";

const client = new PrismaClient();

// Fix: Use the topic name you created in the Aiven dashboard
const TOPIC_NAME = "zap-runs"; 

const kafka = new Kafka({
  clientId: "outbox-processor",
  // Fix: Use environment variables for Render compatibility
  brokers: [process.env.KAFKA_BROKER || ""], 
  ssl: {
    rejectUnauthorized: false, // Required for Aiven's self-signed certificates
    ca: [process.env.KAFKA_CA_CERT || ""],
    key: process.env.KAFKA_KEY_CERT || "",
    cert: process.env.KAFKA_SERVICE_CERT || "",
  },
});

async function main() {
  const producer = kafka.producer();
  try {
    await producer.connect();
    console.log("Producer connected to Aiven Kafka");

    while (true) {
      const pendingRows = await client.zapRunOutbox.findMany({
        take: 10,
      });

      if (pendingRows.length > 0) {
        console.log(`Processing ${pendingRows.length} rows...`);

        // Fix: Use await so the code waits for Kafka to confirm receipt
        await producer.send({
          topic: TOPIC_NAME,
          // Change: Add the type for 'r' (or use 'any' if you want a quick fix)
          messages: pendingRows.map((r: any) => ({
            value: JSON.stringify({ zapRunId: r.zapRunId }),
          })),
        });

        await client.zapRunOutbox.deleteMany({
          where: {
            id: {
              // Change: Add the type for 'x'
              in: pendingRows.map((x: any) => x.id),
            },
          },
        });
        
        console.log("Successfully moved rows to Kafka and cleared Outbox");
      }

      // Important: Add a small delay to avoid 100% CPU usage
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (error) {
    console.error("Processor Error:", error);
  } finally {
    await producer.disconnect();
    await client.$disconnect();
  }
}

main();