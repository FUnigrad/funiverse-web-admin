import { Season } from "./season";

export enum SeasonEnum {
  Spring = 'SPRING',
  Summer = 'SUMMER',
  Fall = 'FALL',
}
export interface Term {
  id:        number;
  season:    Season;
  year:      string;
  startDate: string;
}

