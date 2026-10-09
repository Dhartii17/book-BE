import { z } from "zod";

export const createTaskSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    assignedTo: z
      .string()
      .min(1),
      
     assignedBy: z.string(),
  });

export const updateStatusSchema =
  z.object({
    status: z.enum([
      "todo",
      "in-progress",
      "done",
    ]),
  });

export const assignTaskSchema =
  z.object({
    assignedTo: z
      .string()
      .min(1),
  });