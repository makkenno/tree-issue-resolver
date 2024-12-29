import { z } from "zod";

export const issueTitlesSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
  })
  .array();

type IssueTitlesType = z.infer<typeof issueTitlesSchema>;
