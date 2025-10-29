import { getMatches as getMatchesRepo, createManyMatches } from "../repositories/match";
import { getTeams as getTeamsRepo } from "../repositories/teams";
import { MatchData } from "../types/interfaces/IMatchData";

export const getMatches = async (homeTeamId?: number, awayTeamId?: number) => {
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

  return await getMatchesRepo(homeTeamId, awayTeamId);
}

export const uploadMatches = async (): Promise<string> => {
  try {
    // 1. Fetch matches from the external API
    const token = process.env.API_SOCCER_KEY;
    if (!token) throw new Error("API token not set");

    const res = await fetch(`https://api.soccerdataapi.com/matches/?league_id=216&auth_token=${token}`);
    const apiData = (await res.json()) as MatchData[];

    // 2. Fetch all teams from the local database and create a name-to-ID map
    const localTeams = await getTeamsRepo();
    const teamNameToIdMap = new Map(localTeams.map(team => [team.name.toLowerCase(), team.id]));

    const matchesToCreate: {
      homeTeamId: number;
      awayTeamId: number;
      homeScore: number;
      awayScore: number;
      date: Date;
    }[] = [];

    // 3. Process the API data
    for (const league of apiData) {
      for (const stage of league.stage) {
        for (const match of stage.matches) {
          const homeTeamName = match.teams.home.name;
          const awayTeamName = match.teams.away.name;

          // 4. Find local team IDs by name
          const homeTeamId = teamNameToIdMap.get(homeTeamName.toLowerCase());
          const awayTeamId = teamNameToIdMap.get(awayTeamName.toLowerCase());

          // 5. Validate that teams exist in the local DB
          if (!homeTeamId) {
            console.warn(`Skipping match: Home team "${homeTeamName}" not found in the database.`);
            continue;
          }
          if (!awayTeamId) {
            console.warn(`Skipping match: Away team "${awayTeamName}" not found in the database.`);
            continue;
          }

          const goals = match.goals;
          const [day, month, year] = match.date.split('/');
          const matchTime = match.time || "19:00:00";
          const isoDate = new Date(`${year}-${month}-${day}T${matchTime}Z`);

          matchesToCreate.push({
            homeTeamId: homeTeamId,
            awayTeamId: awayTeamId,
            homeScore: goals.home_ft_goals,
            awayScore: goals.away_ft_goals,
            date: isoDate,
          });
        }
      }
    }

    // 6. Insert the new matches into the database
    if (matchesToCreate.length > 0) {
      await createManyMatches(matchesToCreate);
    }

    return `Matches uploaded successfully. ${matchesToCreate.length} new matches created.`;
  } catch (error) {
    console.error("Upload matches error:", error);
    throw new Error("Failed to upload matches");
  }
};
