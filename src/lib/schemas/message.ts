import { z } from "zod";

export const SendMessageSchema = z.object({
  receiverId: z.string().min(1, "Destinataire requis"),
  subject: z.string().max(200).optional(),
  content: z.string().min(1, "Message requis").max(5000),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
