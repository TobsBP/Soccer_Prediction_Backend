import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from "@prisma/client";
import { MatchData } from '../types';

const prisma = new PrismaClient();

export const uploadMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matchesRes = await fetch("https://api.soccerdataapi.com/matches/?league_id=216&auth_token=f75fa4f597cbff73807076abab20eee64de9be4f");
    const data = (await matchesRes.json()) as MatchData[];

    for (const league of data) {
      for (const stage of league.stage) {
        for (const match of stage.matches) {
          const home = match.teams.home;
          const away = match.teams.away;
          const goals = match.goals;

          await prisma.team.upsert({
            where: { id: home.id.toString() },
            update: {},
            create: { id: home.id.toString(), name: home.name },
          });

          await prisma.team.upsert({
            where: { id: away.id.toString() },
            update: {},
            create: { id: away.id.toString(), name: away.name },
          });

          const [day, month, year] = match.date.split('/');
          const matchTime = match.time || "2025-11-13T19:00:00";
          const isoDate = new Date(`${year}-${month}-${day}T${matchTime}:00Z`);

          await prisma.match.create({
            data: {
              homeTeamId: home.id.toString(),
              awayTeamId: away.id.toString(),
              homeScore: goals.home_ft_goals,
              awayScore: goals.away_ft_goals,
              date: isoDate,
            },
          });
        }
      }
    }

    return reply.status(200).send({ message: "Matches uploaded." });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'An error occurred while fetching games.' });
  }
};
