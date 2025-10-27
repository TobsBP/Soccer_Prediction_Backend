import { PrismaClient } from "@prisma/client";
import { MatchData } from '../types';

const prisma = new PrismaClient();

export const getMatches = async (homeTeamId?: string, awayTeamId?: string) => {
  const whereClause: any = {};

  if (homeTeamId && awayTeamId) {
    whereClause.OR = [
      { homeTeamId: homeTeamId, awayTeamId: awayTeamId },
      { homeTeamId: awayTeamId, awayTeamId: homeTeamId },
    ];
  } else if (homeTeamId) {
    whereClause.OR = [
      { homeTeamId: homeTeamId },
      { awayTeamId: homeTeamId },
    ];
  } else if (awayTeamId) {
    whereClause.OR = [
      { homeTeamId: awayTeamId },
      { awayTeamId: awayTeamId },
    ];
  }

  return await prisma.match.findMany({
    where: whereClause,
    include: {
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
    },
    orderBy: {
      date: 'asc', // Order by date to easily get last 5
    },
  });
}

export const uploadMatches = async (): Promise<string> => {
  try {
    const token = process.env.API_SOCCER_KEY;
    if (!token) throw new Error("API token not set");

    const res = await fetch(`https://api.soccerdataapi.com/matches/?league_id=216&auth_token=${token}`);
    const data = (await res.json()) as MatchData[];

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

    return "Matches uploaded successfully.";
  } catch (error) {
    console.error("Upload matches error:", error);
    throw new Error("Failed to upload matches");
  }
};