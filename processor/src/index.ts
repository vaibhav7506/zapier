import { PrismaClient } from "@prisma/client";
import express from 'express';
import { Kafka } from "kafkajs";

const client = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3003;

// Topic name must match your Aiven dashboard configuration
const TOPIC_NAME = "zap-runs"; 

// Kafka configuration using SSL certificates for Aiven
const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: [process.env.KAFKA_BROKER || ""], 
  ssl: {
    rejectUnauthorized: false, // Essential for Aiven's self-signed certs
    ca: [process.env.KAFKA_CA_CERT || ""],
    key: process.env.KAFKA_KEY_CERT || "",
    cert: process.env.KAFKA_SERVICE_CERT || "",
  },
});

async function main() {
  const producer = kafka.producer();
  
  try {
    // Connect to Aiven Kafka
    await producer.connect();
    console.log("Producer connected to Aiven Kafka");

    // Continuous polling loop
    while (true) {
      // Fetch the top 10 pending runs from the outbox
      const pendingRows = await client.zapRunOutbox.findMany({
        take: 10,
      });

      if (pendingRows.length > 0) {
        console.log(`Processing ${pendingRows.length} rows...`);

        // Send messages to Kafka
        await producer.send({
          topic: TOPIC_NAME,
          messages: pendingRows.map((r: any) => ({
            value: JSON.stringify({ zapRunId: r.zapRunId }),
          })),
        });

        // Delete processed rows from outbox to prevent duplicates
        await client.zapRunOutbox.deleteMany({
          where: {
            id: {
              in: pendingRows.map((x: any) => x.id),
            },
          },
        });
        
        console.log("Successfully moved rows to Kafka and cleared Outbox");
      }

      // 1-second delay to prevent 100% CPU usage
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (error) {
    console.error("Processor Error:", error);
  } finally {
    // Graceful shutdown
    await producer.disconnect();
    await client.$disconnect();
  }
}

// 1. Health check endpoint for Render
app.get('/', (req, res) => {
  res.send('Worker is healthy and running!');
});

// 2. Start the Express server first so Render sees the open port immediately
app.listen(PORT, () => {
  console.log(`Health check server listening on port ${PORT}`);
  
  // 3. Start the main background loop
  main().catch((err) => {
    console.error("Fatal error in main loop:", err);
  });
});