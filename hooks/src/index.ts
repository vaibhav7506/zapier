import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const app = express();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    // Fix: Explicitly typing 'tx' to resolve the 'any' error
    // In Prisma, the transaction client type is derived from your main client
   await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
        data: {
            // Change zapId to ZapId (match the suggestion in your error log)
            zapId: zapId, 
            metadata: body
        }
    });

    await tx.zapRunOutbox.create({
        data: {
            zapRunId: run.id
        }
    });
});

    res.json({
        message: "Webhook received"
    });
});

// Use the PORT environment variable for Render compatibility
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Hooks server running on port ${PORT}`);
});