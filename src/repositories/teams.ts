import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeams = async () => {
  return await prisma.team.findMany({
    select: {
      id: true,
      name: true
    }
  });
}

export const getTeam = async (id: number) => {
  return await prisma.team.findUnique({
    where: { id },
    select: {
      id: true,
      name: true
    }
  });
}

export const createManyTeams = async (teamNames: { name: string }[]) => {
  return await prisma.team.createMany({
    data: teamNames,
    skipDuplicates: true,
  });
}