import type { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod";

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>

export interface MatchData {
  stage: {
    matches: {
      teams: {
        home: {
          id: number;
          name: string;
        };
        away: {
          id: number;
          name: string;
        };
      };
      goals: {
        home_ft_goals: number;
        away_ft_goals: number;
      };
      date: string;
      time: string;
    }[];
  }[];
}

export interface Team {
  id: number,
  name: string
}

export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
});

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