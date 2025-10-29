import { formatterMatches } from '../formatters/matches';
import { PrismaClient } from '@prisma/client';
import { ai } from '../services/gemini';

const prisma = new PrismaClient();

export const askAI = async (homeTeamId: number, awayTeamId: number) => {
  // 1. Find the match
  const match = await prisma.match.findFirst({
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

  if (!match) {
    throw new Error("No upcoming match found for the given teams.");
  }

  // 2. Check for existing prediction
  const existingPrediction = await prisma.predictions.findUnique({
    where: {
      matchId: match.id,
    },
  });

  if (existingPrediction) {
    return `${existingPrediction.predictedHomeScore}-${existingPrediction.predictedAwayScore}`;
  }

  // 3. If no prediction, generate, save, and return
  const prompt = await formatterMatches(homeTeamId, awayTeamId);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // @ts-ignore
  const predictionText = response.candidates[0].content.parts[0].text;
  
  if (!predictionText) {
    throw new Error("Failed to get prediction from AI");
  }

  const [predictedHomeScore, predictedAwayScore] = predictionText.split('-').map(Number);

  await prisma.predictions.create({
    data: {
      matchId: match.id,
      predictedHomeScore,
      predictedAwayScore,
    },
  });

  return predictionText;
};