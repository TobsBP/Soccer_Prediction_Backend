import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from 'fastify';
import { MatchData } from '../types';

const prisma = new PrismaClient();

export const getMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await prisma.match.findMany();

    return reply.status(200).send({ data });
  } catch (error) {
    console.error("Can't reach the matches:", error);
    return reply.status(500).send({ message: "Failed to fetch matches" });
  }
}

export const uploadMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = process.env.API_SOCCER_KEY;
    const matchesRes = await fetch(`https://api.soccerdataapi.com/matches/?league_id=216&auth_token=${token}`);
    const data = (await matchesRes.json()) as MatchData[];

    const teamsToCreate = new Map<string, { id: string; name: string }>();
    const matchesToCreate: {
      homeTeamId: string;
      awayTeamId: string;
      homeScore: number;
      awayScore: number;
      date: Date;
    }[] = [];

    for (const league of data) {
      for (const stage of league.stage) {
        for (const match of stage.matches) {
          const home = match.teams.home;
          const away = match.teams.away;
          const goals = match.goals;

          teamsToCreate.set(home.id.toString(), { id: home.id.toString(), name: home.name });
          teamsToCreate.set(away.id.toString(), { id: away.id.toString(), name: away.name });

          const [day, month, year] = match.date.split('/');
          const matchTime = match.time || "19:00:00";
          const isoDate = new Date(`${year}-${month}-${day}T${matchTime}Z`);

          matchesToCreate.push({
            homeTeamId: home.id.toString(),
            awayTeamId: away.id.toString(),
            homeScore: goals.home_ft_goals,
            awayScore: goals.away_ft_goals,
            date: isoDate,
          });
        }
      }
    }

    const teams = Array.from(teamsToCreate.values());

    await prisma.$transaction(async (tx) => {
      await tx.team.createMany({
        data: teams,
        skipDuplicates: true,
      });

      await tx.match.createMany({
        data: matchesToCreate,
        skipDuplicates: true,
      });
    });

    return reply.status(201).send({ message: "Matches uploaded." });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'An error occurred while fetching games.' });
  }
};