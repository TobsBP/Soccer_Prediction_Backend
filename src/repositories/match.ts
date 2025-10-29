import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMatches = async (homeTeamId?: number, awayTeamId?: number) => {
  return await prisma.match.findMany({
      where: { homeTeamId, awayTeamId},
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
      orderBy: {
      date: 'asc',
    },
  });
}

export const createManyMatches = async (matches: any[]) => {
  return await prisma.match.createMany({
    data: matches,
    skipDuplicates: true,
  });
};

export const findMatch = async (homeTeamId: number, awayTeamId: number) => {
  return await prisma.match.findFirst({
    where: {
      homeTeamId,
      awayTeamId,
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    }
  });
};