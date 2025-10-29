import type { FastifyTypedInstance } from '../types'
import { getTeams, getTeam, uploadTeams } from '../resolvers/teams';
import z from "zod"

const teamSchema = z.object({
  id: z.number(),
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
      },
      tags: ['Team']
    },
  }, async (request, reply) => {
    try {
      const teams = await getTeams();
      return reply.status(200).send({ data: teams });
    } catch (error) {
      console.error("Can't reach the teams:", error);
      return reply.status(500).send({ message: "Failed to fetch teams" });
    }
  });

  server.get('/getTeam', {
    schema: {
      querystring: z.object({
        id: z.number(),
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
      tags: ['Team']
    },
  }, async (request, reply) => {
    try {
      const team = await getTeam(Number(request.query.id));
      if (!team) {
        return reply.status(404).send({ message: "Team not found" });
      }
      return reply.status(200).send(team);
    } catch (error) {
      console.error("Can't reach the team:", error);
      return reply.status(500).send({ message: "Failed to fetch team" });
    }
  });

  server.get('/uploadTeams', {
    schema: {
      description: 'Upload teams from external API',
      response: {
        200: z.object({
          data: z.array(z.string()),
        }),
        404: z.object({
          message: z.string(),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
      tags: ['Team']
    },
  }, async (request, reply) => {
    try {
      const teams = await uploadTeams();
      
      if (!teams) {
        return reply.status(404).send({ message: "Team not found" });
      }
      
      return reply.status(200).send({ data: teams });
    } catch (error) {
      console.error("Can't reach the teams:", error);
      return reply.status(500).send({ message: "Failed to fetch teams" });
    }
  });

}
