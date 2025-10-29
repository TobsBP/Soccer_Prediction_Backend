import { teamSchema } from "./team";
import z from "zod";

export const matchSchema = z.object({
  id: z.number(),
  homeTeamId: z.number(),
  awayTeamId: z.number(),
  homeScore: z.number(),
  awayScore: z.number(),
  date: z.date(),
  homeTeam: teamSchema,
  awayTeam: teamSchema,
});