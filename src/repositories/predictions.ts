import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUniquePrediction = async (matchId: number) => {
  return await prisma.predictions.findUnique({
    where: {
      matchId: matchId,
    },
  });
};

export const createPrediction = async (data: { matchId: number; predictedHomeScore: number; predictedAwayScore: number; }) => {
  return await prisma.predictions.create({
    data,
  });
};
