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
  triggerMetadata: z.record(z.unknown()).optional().default({}),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetadata: z.record(z.unknown()).optional().default({}),
    })
  ),
});
