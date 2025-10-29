import { getMatches } from "../resolvers/matches";

export async function formatterMatches(homeTeamId: number, awayTeamId: number) {
  const matches = await getMatches(homeTeamId, awayTeamId);

  if (matches.length === 0) {
    return "No matches found to predict.";
  }

  let matchToPredict;
  if (homeTeamId && awayTeamId) {
    // Find the most recent match between the two specified teams
    matchToPredict = matches.find(
      (m) =>
        (m.homeTeamId === homeTeamId && m.awayTeamId === awayTeamId) ||
        (m.homeTeamId === awayTeamId && m.awayTeamId === homeTeamId)
    );
    if (!matchToPredict) {
      return "No recent match found between the specified teams.";
    }
  } else {
    // If no specific teams are provided, predict the last match in the database
    matchToPredict = matches[matches.length - 1];
  }

  const homeTeam = matchToPredict.homeTeam;
  const awayTeam = matchToPredict.awayTeam;

  const homeTeamMatches = matches
    .filter(
      (m) =>
        m.homeTeamId === homeTeam.id || m.awayTeamId === homeTeam.id
    )
    .slice(-5);

  const awayTeamMatches = matches
    .filter(
      (m) =>
        m.homeTeamId === awayTeam.id || m.awayTeamId === awayTeam.id
    )
    .slice(-5);

  const prompt = `
    You are a soccer specialist. Predict the next game result based on the last games.

    1. **Which teams are playing?**
       - ${homeTeam.name} vs. ${awayTeam.name}

    2. **What are the recent results of BOTH teams?**
       - **${homeTeam.name}'s last 5 games:**
         ${homeTeamMatches
           .map(
             (m) =>
               `  - ${m.homeTeam.name} ${m.homeScore} - ${m.awayScore} ${m.awayTeam.name}`
           )
           .join("\n")}
       - **${awayTeam.name}'s last 5 games:**
         ${awayTeamMatches
           .map(
             (m) =>
               `  - ${m.homeTeam.name} ${m.homeScore} - ${m.awayScore} ${m.awayTeam.name}`
           )
           .join("\n")}
  `;

  return prompt;
}