import { getMatches, uploadMatches } from '../resolvers/matches'
import type { FastifyTypedInstance } from '../types'
import z from "zod"

const matchSchema = z.object({
  id: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  homeScore: z.number(),
  awayScore: z.number(),
  date: z.string(), // or z.date() if you parse it
});

export async function matchRoutes(server: FastifyTypedInstance) {
  server.post('/uploadMatches', {
    schema: {
      description: 'Uploads and stores match data from SoccerData API',
      response: {
        201: z.object({
          message: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
  }, uploadMatches);

  server.get('/getMatches', {
    schema: {
      description: 'Get all Matches',
      response: {
        200: z.object({
          data: z.array(matchSchema),
        }),
        500: z.object({
          message: z.string(),
        }),
      }
    }
  }, getMatches);
}
