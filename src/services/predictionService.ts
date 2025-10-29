import { formatterMatches } from '../utils/formatters/matches';
import { ai } from '../config/gemini';
import { findMatch } from '../repositories/match';
import { findUniquePrediction, createPrediction } from '../repositories/predictions';

export const askAI = async (homeTeamId: number, awayTeamId: number) => {
  // 1. Find the match
  const match = await findMatch(homeTeamId, awayTeamId);

  if (!match) {
    throw new Error("No upcoming match found for the given teams.");
  }

  // 2. Check for existing prediction
  const existingPrediction = await findUniquePrediction(match.id);

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

  await createPrediction({
    matchId: match.id,
    predictedHomeScore,
    predictedAwayScore,
  });

  return predictionText;
};
