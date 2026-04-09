export type DayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type DayValueKey = `day${DayIndex}`;
type DayStatusKey = `day${DayIndex}_${"blocked" | "overdue"}`;

export type DayCellRecord = Record<DayValueKey, number> &
  Record<DayStatusKey, boolean>;

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
