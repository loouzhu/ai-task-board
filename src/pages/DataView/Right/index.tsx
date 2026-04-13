import styles from "./index.module.less";
import { Table, Tag } from "@arco-design/web-react";
import dayjs from "dayjs";
import { formatData } from "@/utils/common";
import { Segmented } from "antd";
import DateCell from "@/components/DayCell";
import WeekCell from "@/components/WeekCell";
import { useAllBoards } from "@/hooks/useBoard";
import { useGetPeriodTask } from "@/hooks/useTask";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  MonthDataRecord,
  WeekDataRecord,
  WeekdayKey,
  MonthWeekCellData,
} from "@/types/dataView";
import type { dateType } from "@/types/task";

const weekdayKeys: WeekdayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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
    typeof cell.task === "number" &&
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
    typeof cell.task === "number" &&
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
  const navigate = useNavigate();
  const { teamId, boardId } = useParams();
  const boardList = useAllBoards().data;
  const boards = useMemo(() => boardList?.boards ?? [], [boardList?.boards]);
  const periodTaskResponse = useGetPeriodTask(dateType).data as
    | PeriodTaskResponse
    | undefined;

  useEffect(() => {
    if (!teamId || boards.length === 0) return;

    const hasMatchedBoard = boards.some((item) => item.boardId === boardId);
    const nextBoardId = hasMatchedBoard ? boardId : boards[0].boardId;

    if (boardId !== nextBoardId) {
      navigate(`/team/${teamId}/data-view/${nextBoardId}`, { replace: true });
    }
  }, [boardId, boards, navigate, teamId]);

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
        <DateCell dayData={value} />
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
    {
      title: monthLabels[0],
      dataIndex: "week1",
      width: 90,
      align: "center" as const,
      render: (value: MonthDataRecord["week1"], record: MonthDataRecord) => (
        <WeekCell weekData={value} weekIndex={1} memberName={record.name} />
      ),
    },
    {
      title: monthLabels[1],
      dataIndex: "week2",
      width: 90,
      align: "center" as const,
      render: (value: MonthDataRecord["week2"], record: MonthDataRecord) => (
        <WeekCell weekData={value} weekIndex={2} memberName={record.name} />
      ),
    },
    {
      title: monthLabels[2],
      dataIndex: "week3",
      width: 90,
      align: "center" as const,
      render: (value: MonthDataRecord["week3"], record: MonthDataRecord) => (
        <WeekCell weekData={value} weekIndex={3} memberName={record.name} />
      ),
    },
    {
      title: monthLabels[3],
      dataIndex: "week4",
      width: 90,
      align: "center" as const,
      render: (value: MonthDataRecord["week4"], record: MonthDataRecord) => (
        <WeekCell weekData={value} weekIndex={4} memberName={record.name} />
      ),
    },
    {
      title: monthLabels[4],
      dataIndex: "week5",
      width: 90,
      align: "center" as const,
      render: (value: MonthDataRecord["week5"], record: MonthDataRecord) => (
        <WeekCell weekData={value} weekIndex={5} memberName={record.name} />
      ),
    },
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
            <Segmented<string>
              options={["本周", "本月"]}
              value={dateType === "week" ? "本周" : "本月"}
              onChange={(value) => {
                setDateType(value === "本周" ? "week" : "month");
              }}
            />
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
