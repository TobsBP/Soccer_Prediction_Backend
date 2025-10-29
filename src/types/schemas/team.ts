import z from "zod";

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
});
