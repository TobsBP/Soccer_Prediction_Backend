import { getMatches, uploadMatches } from '../services/matchService'
import { authenticateApiKey } from '../middlewares/auth'
import type { FastifyTypedInstance } from '../types/type'
import { matchSchema } from '../types/schemas/Match'
import z from "zod"

export async function matchRoutes(server: FastifyTypedInstance) {
  server.post('/uploadMatches', {
    preHandler: authenticateApiKey,
    schema: {
      description: 'Uploads and stores match data from SoccerData API',
      response: {
        200: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
      tags: ['Matches']
    },
  }, async (request, reply) => {
    try {
      const result = await uploadMatches();
      return reply.status(200).send({ message: result });
    } catch (error) {
      console.error("Upload error:", error);
      return reply.status(500).send({ message: "Failed to upload matches" });
    }
  });

  server.get('/getMatches', {
    preHandler: authenticateApiKey,
    schema: {
      description: 'Get all Matches',
      response: {
        200: z.object({
          data: z.array(matchSchema),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
      tags: ['Matches']
    },
  }, async (request, reply) => { 
    try {
      const matches = await getMatches();
      return reply.status(200).send({ data: matches });
    } catch (error) {
      console.error("Fetch error:", error);
      return reply.status(500).send({ message: "Failed to fetch matches" });
    }
  });
}
