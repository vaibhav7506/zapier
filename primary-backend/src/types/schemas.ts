import { z } from "zod";

export const SigninSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
});

export const SignupSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const ZapCreateSchema = z.object({
  availableTriggerId: z.string(),
  // Explicitly add z.string() as the key type
  triggerMetadata: z.record(z.string(), z.unknown()).default({}), 
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      // Explicitly add z.string() as the key type
      actionMetadata: z.record(z.string(), z.unknown()).default({}), 
    })
  ),
});