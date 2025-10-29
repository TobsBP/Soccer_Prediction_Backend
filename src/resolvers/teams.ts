import { PrismaClient } from "@prisma/client";
import type { MatchData } from "../types";

const prisma = new PrismaClient();

export const getTeams = async () => {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      name: true
    }
  });

  return teams;
}

export const getTeam = async (id: number) => {
  const team = await prisma.team.findUnique({
    where: { id },
    select: {
      id: true,
      name: true
    }
  });

  return team;
}

export const uploadTeams = async (): Promise<string[]> => {
  try {
    const token = process.env.API_SOCCER_KEY;
    if (!token) throw new Error("API token not set");

    const res = await fetch(`https://api.soccerdataapi.com/matches/?league_id=216&auth_token=${token}`);
    const data = (await res.json()) as MatchData[];

    const teamNamesSet = new Set<string>();

    for (const league of data) {
      for (const stage of league.stage) {
        for (const match of stage.matches) {
          teamNamesSet.add(match.teams.home.name);
          teamNamesSet.add(match.teams.away.name);
        }
      }
    }

    const teamNames = Array.from(teamNamesSet);

    await prisma.team.createMany({
      data: teamNames.map((name) => ({ name })),
      skipDuplicates: true,
    });

    return teamNames;
  } catch (error) {
    console.error("Upload team names error:", error);
    throw new Error("Failed to upload team names");
  }
};