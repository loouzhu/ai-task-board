export type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DayCellData {
  task: number;
  blocked: boolean;
  delay: boolean;
}

export type DayCellRecord = Record<WeekdayKey, DayCellData>;

export interface WeekDataRecord extends DayCellRecord {
  key: string;
  name: string;
  weekTotal: number;
}

export interface MonthDataRecord {
  key: string;
  name: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  total: number;
}
