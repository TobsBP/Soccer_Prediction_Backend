import type { FastifyTypedInstance } from '../types'
import { askAI } from '../resolvers/predictions'
import z from 'zod'

export async function aiRoutes(server: FastifyTypedInstance) {
  server.get('/askAI', {
    schema: {
      querystring: z.object({
        homeTeamId: z.string(),
        awayTeamId: z.string(),
      }),
      description: 'Get AI predictions for matches',
      response: {
        200: z.object({
          data: z.unknown(),
        }),
        400: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
      tags: ['AI'],
    },
  }, async (request, reply) => {
    try {
      const { homeTeamId, awayTeamId } = request.query;

      if (!homeTeamId || !awayTeamId) {
        return reply.status(400).send({ message: "Both homeTeamId and awayTeamId are required." });
      }

      const predictions = await askAI(homeTeamId, awayTeamId);

      return reply.status(200).send({ data: predictions });
    } catch (error) {
      console.error('AI prediction error:', error);

      return reply.status(500).send({ message: 'Failed to fetch AI predictions' });
    }
  });
}
