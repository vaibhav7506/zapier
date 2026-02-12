import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
const client = new PrismaClient();

const Topic_Name = "zap-events"

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ['localhost:9092'],
})
async function main() {
  const producer = kafka.producer();
  await producer.connect();

    while(1){
  const pendingrows =  await client.zapRunOutbox.findMany({
    where :{},
    take : 10
  })
 
    producer.send({
      topic: Topic_Name,
      messages: pendingrows.map(r=>{
        return{
          value: r.zapRunId
        }
      })
    })
  
await client.zapRunOutbox.deleteMany({
  where:{
    id:{
      in: pendingrows.map(x=>x.id)
    }
  }
  })   
 }
}
 

main();
