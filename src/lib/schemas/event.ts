import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(1, "Titre requis").max(200),
  description: z.string().min(1, "Description requise").max(5000),
  startDate: z.coerce.date({ message: "Date de debut invalide" }),
  endDate: z.coerce.date({ message: "Date de fin invalide" }),
  location: z.string().min(1, "Lieu requis").max(300),
  imageUrl: z.string().url("URL invalide").optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "La date de fin doit etre apres la date de debut",
  path: ["endDate"],
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = z.object({
  title: z.string().min(1, "Titre requis").max(200),
  description: z.string().min(1, "Description requise").max(5000),
  startDate: z.coerce.date({ message: "Date de debut invalide" }),
  endDate: z.coerce.date({ message: "Date de fin invalide" }),
  location: z.string().min(1, "Lieu requis").max(300),
  imageUrl: z.string().url("URL invalide").optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "La date de fin doit etre apres la date de debut",
  path: ["endDate"],
});

export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;

export const EventFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type EventFilter = z.infer<typeof EventFilterSchema>;
