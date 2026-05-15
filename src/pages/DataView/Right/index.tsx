import styles from "./index.module.less";
import { Switch, Table, Tag } from "@arco-design/web-react";
import dayjs from "dayjs";
import { formatData } from "@/utils/common";
import DateCell from "@/components/DayCell";
import WeekCell from "@/components/WeekCell";
import { useGetPeriodTask } from "@/hooks/useTask";
import { useParams } from "react-router-dom";
import type {
  MonthDataRecord,
  WeekDataRecord,
  WeekdayKey,
  MonthWeekCellData,
} from "@/types/dataView";
import type { dateType } from "@/types/task";
import { useTheme } from "@/hooks/useTheme";

const weekdayKeys: WeekdayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const monthWeekKeys = ["week1", "week2", "week3", "week4", "week5"] as const;
type MonthWeekKey = (typeof monthWeekKeys)[number];

const weekdayLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const getWeekStart = (date: dayjs.Dayjs) => {
  const day = date.day();
  const diff = day === 0 ? -6 : 1 - day;
  return date.add(diff, "day").startOf("day");
};

interface PeriodTaskResponse {
  success?: boolean;
  message?: string;
  dateType?: dateType;
  startDate?: string;
  endDate?: string;
  rows?: Array<WeekDataRecord | MonthDataRecord>;
}

const isDayCellData = (value: unknown): value is WeekDataRecord[WeekdayKey] => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const cell = value as Record<string, unknown>;
  return (
    typeof cell.completed_task === "number" &&
    typeof cell.blocked === "boolean" &&
    typeof cell.overdue === "boolean"
  );
};

const isMonthWeekCellData = (value: unknown): value is MonthWeekCellData => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const cell = value as Record<string, unknown>;
  return (
    typeof cell.completed_task === "number" &&
    typeof cell.startDate === "string" &&
    typeof cell.endDate === "string"
  );
};

const isWeekRow = (value: unknown): value is WeekDataRecord => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Record<string, unknown>;
  return (
    typeof row.key === "string" &&
    typeof row.name === "string" &&
    typeof row.weekTotal === "number" &&
    weekdayKeys.every((weekdayKey) => isDayCellData(row[weekdayKey]))
  );
};

const isMonthRow = (value: unknown): value is MonthDataRecord => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Record<string, unknown>;
  return (
    typeof row.key === "string" &&
    typeof row.name === "string" &&
    typeof row.total === "number" &&
    ["week1", "week2", "week3", "week4", "week5"].every((weekKey) =>
      isMonthWeekCellData(row[weekKey]),
    )
  );
};

export default function Right({
  dateType,
  setDateType,
}: {
  dateType: dateType;
  setDateType: (type: dateType) => void;
}) {
  const date = new Date();
  const { isDark } = useTheme();
  const { teamId } = useParams();
  const periodTaskResponse = useGetPeriodTask(
    dateType,
    teamId?.toString() || "",
  ).data as PeriodTaskResponse | undefined;

  const weekStart = periodTaskResponse?.startDate
    ? getWeekStart(dayjs(periodTaskResponse.startDate))
    : getWeekStart(dayjs());
  const weekDates = weekdayKeys.map((_, index) => weekStart.add(index, "day"));
  const weekData = (periodTaskResponse?.rows ?? []).filter(isWeekRow);
  const monthData = (periodTaskResponse?.rows ?? []).filter(isMonthRow);

  const weekColumns = [
    {
      title: "成员名",
      dataIndex: "name",
      fixed: "left" as const,
      width: 90,
      align: "center" as const,
      render: (name: string, record: WeekDataRecord) => (
        <div>
          <span style={{ fontWeight: 500, cursor: "pointer" }}>{name}</span>
          <div style={{ fontSize: 12, color: "#86909c", marginTop: 4 }}>
            总计: {record.weekTotal || 0}个
          </div>
        </div>
      ),
    },
    ...weekdayKeys.map((weekdayKey, index) => ({
      title: (
        <div>
          {weekDates[index].format("M/D")}
          <br />
          {weekdayLabels[index]}
        </div>
      ),
      dataIndex: weekdayKey,
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord[typeof weekdayKey]) => (
        <DateCell dayData={value} isDark={isDark} />
      ),
    })),
  ];

  const monthLabels = monthData.length
    ? [
        monthData[0].week1,
        monthData[0].week2,
        monthData[0].week3,
        monthData[0].week4,
        monthData[0].week5,
      ].map((weekData, index) => (
        <div>
          第{index + 1}周<br />
          {dayjs(weekData.startDate).format("M/D")}-
          {dayjs(weekData.endDate).format("M/D")}
        </div>
      ))
    : Array.from({ length: 5 }, (_, index) => `第${index + 1}周`);

  const monthColumns = [
    {
      title: "成员名",
      dataIndex: "name",
      fixed: "left" as const,
      width: 90,
      align: "center" as const,
      render: (name: string, record: MonthDataRecord) => (
        <div>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <div style={{ fontSize: 12, color: "#86909c", marginTop: 4 }}>
            <Tag
              color={
                record.total > 30
                  ? "green"
                  : record.total > 15
                    ? "orange"
                    : "red"
              }
              size="small"
            >
              总计: {record.total}
            </Tag>
          </div>
        </div>
      ),
    },
    ...monthWeekKeys.map((weekKey, index) => ({
      title: monthLabels[index],
      dataIndex: weekKey,
      width: 90,
      align: "center" as const,
      render: (
        value: MonthDataRecord[MonthWeekKey],
        record: MonthDataRecord,
      ) => (
        <WeekCell
          weekData={value}
          weekIndex={index + 1}
          memberName={record.name}
          isDark={isDark}
        />
      ),
    })),
  ];

  return (
    <div className={styles.right}>
      <section className={styles.header}>
        <header>
          <strong className={styles.title}>
            团队成员贡献日历
            <div className={styles.date}>今天是 {formatData(date)}</div>
          </strong>
          <div className={styles.options}>
            <div className={styles.dateTypeSwitch}>
              <Switch
                checked={dateType === "month"}
                type="round"
                className={styles.dateTypeToggle}
                checkedText="本月"
                uncheckedText="本周"
                onChange={(checked) => {
                  setDateType(checked ? "month" : "week");
                }}
              />
            </div>
          </div>
        </header>
      </section>
      <section className={styles.content}>
        <div className={styles.tableWrap}>
          {dateType === "week" ? (
            <Table
              columns={weekColumns}
              border={{
                wrapper: true,
                cell: true,
              }}
              data={weekData}
              pagination={false}
              scroll={{ y: 510 }}
            />
          ) : (
            <Table
              columns={monthColumns}
              border={{
                wrapper: true,
                cell: true,
              }}
              data={monthData}
              pagination={false}
              scroll={{ y: 510 }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
