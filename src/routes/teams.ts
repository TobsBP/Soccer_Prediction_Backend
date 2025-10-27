import type { FastifyTypedInstance } from '../types'
import { getTeams, getTeam } from '../resolvers/teams';
import z from "zod"

const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export async function teamRoutes(server: FastifyTypedInstance) {
  server.get('/getTeams', {
    schema: {
      description: 'Get all Teams',
      response: {
        200: z.object({
          data: z.array(teamSchema),
        }),
        500: z.object({
          message: z.string(),
        }),
      }
    }
  }, getTeams);

  server.get('/getTeam', {
    schema: {
      querystring: z.object({
        id: z.string(),
      }),
      description: 'Get a Team by ID',
      response: {
        200: teamSchema,
        404: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
    },
  }, getTeam);
}
