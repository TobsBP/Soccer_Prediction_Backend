import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

export const getGames = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const response = await fetch('https://v3.football.api-sports.io/leagues', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.API_SOCCER_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io/2025/131'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const matches = await response.json();
    
    return reply.status(200).send(matches);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'An error occurred while fetching games.' });
  }
};
