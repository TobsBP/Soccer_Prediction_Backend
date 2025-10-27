import { ai } from '../services/predictions';
import { formatterMatches } from '../formatters/matches';

export const askAI = async (homeTeamId: string, awayTeamId: string) => {
  const prompt = await formatterMatches(homeTeamId, awayTeamId);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // @ts-ignore
  const text = response.candidates[0].content.parts[0].text;

  return text;
};
