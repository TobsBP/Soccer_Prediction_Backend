import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await prisma.team.findMany();

    return reply.status(200).send({ data });
  } catch (error) {
    
    return reply.status(500).send({ message: "Failed to fetch teams" });
  }
}

export const getTeam = async (request: FastifyRequest<{ Querystring: { id: string } }>, reply: FastifyReply) => {
  try {
    const { id } = request.query;
    const team = await prisma.team.findUnique({
      where: { id }
    });

    if (!team) {
      return reply.status(404).send({ message: "Team not found" });
    }

    return reply.status(200).send(team);
  } catch (error) {
    console.log("Can't reach the team:", error);
    
    return reply.status(500).send({ message: "Failed to fetch team" });
  }
}