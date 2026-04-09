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
  overdue: boolean;
}

export interface MonthWeekCellData {
  task: number;
  startDate: string;
  endDate: string;
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
  week1: MonthWeekCellData;
  week2: MonthWeekCellData;
  week3: MonthWeekCellData;
  week4: MonthWeekCellData;
  week5: MonthWeekCellData;
  total: number;
}
