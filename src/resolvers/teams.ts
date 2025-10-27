import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async () => {
  const teams = await prisma.team.findMany();

  return teams;
}

export const getTeam = async (id: string) => {
  const team = await prisma.team.findUnique({
    where: { id }
  });

  return team;
}