export interface MatchData {
  stage: {
    matches: {
      teams: {
        home: {
          id: number;
          name: string;
        };
        away: {
          id: number;
          name: string;
        };
      };
      goals: {
        home_ft_goals: number;
        away_ft_goals: number;
      };
      date: string;
      time: string;
    }[];
  }[];
}