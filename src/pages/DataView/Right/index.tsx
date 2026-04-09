import "./index.less";
import { Table, Message, Tag } from "@arco-design/web-react";
import { formatData } from "@/utils/common";
//import { useGetAllUsers } from "@/hooks/useUser";
import { Segmented } from "antd";
import { useState } from "react";
import DateCell from "@/components/DayCell";
import WeekCell from "@/components/WeekCell";
import type { MonthDataRecord, WeekDataRecord } from "@/types/dataView";

export default function Right() {
  const date = new Date();
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // 周视图的列配置（原有的每日明细）
  const weekColumns = [
    {
      title: "成员名",
      dataIndex: "name",
      fixed: "left" as const,
      width: 100,
      align: "center" as const,
      render: (name: string, record: WeekDataRecord) => (
        <div>
          <span
            style={{ fontWeight: 500, cursor: "pointer" }}
            onClick={() => Message.info(`筛选 ${name} 的任务`)}
          >
            {name}
          </span>
          <div style={{ fontSize: 12, color: "#86909c", marginTop: 4 }}>
            总计: {record.weekTotal || 0}个
          </div>
        </div>
      ),
    },
    {
      title: "4/1 (周一)",
      dataIndex: "day1",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={1} />
      ),
    },
    {
      title: "4/2 (周二)",
      dataIndex: "day2",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={2} />
      ),
    },
    {
      title: "4/3 (周三)",
      dataIndex: "day3",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={3} />
      ),
    },
    {
      title: "4/4 (周四)",
      dataIndex: "day4",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={4} />
      ),
    },
    {
      title: "4/5 (周五)",
      dataIndex: "day5",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={5} />
      ),
    },
    {
      title: "4/6 (周六)",
      dataIndex: "day6",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={6} />
      ),
    },
    {
      title: "4/7 (周日)",
      dataIndex: "day7",
      width: 60,
      align: "center" as const,
      render: (value: number, record: WeekDataRecord) => (
        <DateCell value={value} record={record} dayIndex={7} />
      ),
    },
  ];

  // 月视图（热力图矩阵）的列配置
  const monthColumns = [
    {
      title: "成员名",
      dataIndex: "name",
      fixed: "left" as const,
      width: 120,
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
      title: "第1周\n4/1-4/7",
      dataIndex: "week1",
      width: 90,
      align: "center" as const,
      render: (value: number, record: MonthDataRecord) => (
        <WeekCell total={value} weekIndex={1} memberName={record.name} />
      ),
    },
    {
      title: "第2周\n4/8-4/14",
      dataIndex: "week2",
      width: 90,
      align: "center" as const,
      render: (value: number, record: MonthDataRecord) => (
        <WeekCell total={value} weekIndex={2} memberName={record.name} />
      ),
    },
    {
      title: "第3周\n4/15-4/21",
      dataIndex: "week3",
      width: 90,
      align: "center" as const,
      render: (value: number, record: MonthDataRecord) => (
        <WeekCell total={value} weekIndex={3} memberName={record.name} />
      ),
    },
    {
      title: "第4周\n4/22-4/28",
      dataIndex: "week4",
      width: 90,
      align: "center" as const,
      render: (value: number, record: MonthDataRecord) => (
        <WeekCell total={value} weekIndex={4} memberName={record.name} />
      ),
    },
    {
      title: "第5周\n4/29-4/30",
      dataIndex: "week5",
      width: 90,
      align: "center" as const,
      render: (value: number, record: MonthDataRecord) => (
        <WeekCell total={value} weekIndex={5} memberName={record.name} />
      ),
    },
  ];

  // 周视图数据（每日明细 + 周合计）
  const weekData: WeekDataRecord[] = [
    {
      key: "1",
      name: "张三",
      day1: 2,
      day2: 3,
      day3: 1,
      day4: 4,
      day5: 5,
      day6: 0,
      day7: 0,
      day1_blocked: false,
      day2_blocked: true,
      day3_blocked: false,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: true,
      day2_overdue: false,
      day3_overdue: true,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 15,
    },
    {
      key: "2",
      name: "李四",
      day1: 1,
      day2: 2,
      day3: 3,
      day4: 0,
      day5: 2,
      day6: 0,
      day7: 0,
      day1_blocked: false,
      day2_blocked: true,
      day3_blocked: false,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: false,
      day2_overdue: false,
      day3_overdue: false,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 8,
    },
    {
      key: "3",
      name: "王五",
      day1: 0,
      day2: 1,
      day3: 0,
      day4: 1,
      day5: 0,
      day6: 0,
      day7: 0,
      day1_blocked: false,
      day2_blocked: false,
      day3_blocked: false,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: false,
      day2_overdue: false,
      day3_overdue: false,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 2,
    },
    {
      key: "4",
      name: "赵六",
      day1: 3,
      day2: 2,
      day3: 4,
      day4: 2,
      day5: 3,
      day6: 1,
      day7: 0,
      day1_blocked: false,
      day2_blocked: false,
      day3_blocked: true,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: false,
      day2_overdue: false,
      day3_overdue: true,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 15,
    },
    {
      key: "5",
      name: "小明",
      day1: 1,
      day2: 0,
      day3: 2,
      day4: 1,
      day5: 0,
      day6: 0,
      day7: 0,
      day1_blocked: false,
      day2_blocked: false,
      day3_blocked: false,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: false,
      day2_overdue: false,
      day3_overdue: false,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 4,
    },
    {
      key: "6",
      name: "小红",
      day1: 2,
      day2: 2,
      day3: 2,
      day4: 2,
      day5: 2,
      day6: 0,
      day7: 0,
      day1_blocked: false,
      day2_blocked: false,
      day3_blocked: true,
      day4_blocked: false,
      day5_blocked: false,
      day6_blocked: false,
      day7_blocked: false,
      day1_overdue: false,
      day2_overdue: false,
      day3_overdue: false,
      day4_overdue: false,
      day5_overdue: false,
      day6_overdue: false,
      day7_overdue: false,
      weekTotal: 10,
    },
  ];

  // 月视图数据（按周聚合 + 月总计）
  const monthData: MonthDataRecord[] = [
    {
      key: "1",
      name: "张三",
      week1: 15, // 4/1-4/7
      week2: 18, // 4/8-4/14
      week3: 22, // 4/15-4/21
      week4: 20, // 4/22-4/28
      week5: 5, // 4/29-4/30
      total: 80, // 月度总计
    },
    {
      key: "2",
      name: "李四",
      week1: 8,
      week2: 12,
      week3: 10,
      week4: 14,
      week5: 3,
      total: 47,
    },
    {
      key: "3",
      name: "王五",
      week1: 2,
      week2: 0, // 这周请假了
      week3: 1,
      week4: 3,
      week5: 0,
      total: 6, // 明显不活跃
    },
    {
      key: "4",
      name: "赵六",
      week1: 15,
      week2: 20,
      week3: 25,
      week4: 22,
      week5: 6,
      total: 88, // 本月之星
    },
    {
      key: "5",
      name: "小明",
      week1: 4,
      week2: 6,
      week3: 5,
      week4: 7,
      week5: 1,
      total: 23,
    },
    {
      key: "6",
      name: "小红",
      week1: 10,
      week2: 8,
      week3: 12,
      week4: 9,
      week5: 2,
      total: 41,
    },
    {
      key: "7",
      name: "大熊（新成员）",
      week1: 0, // 4月中旬才加入
      week2: 0,
      week3: 4,
      week4: 8,
      week5: 3,
      total: 15,
    },
    {
      key: "8",
      name: "静香（已离职）",
      week1: 12,
      week2: 10,
      week3: 5, // 第三周后半周离职
      week4: 0,
      week5: 0,
      total: 27,
    },
  ];

  // 根据视图模式选择数据和列
  const currentColumns = viewMode === "week" ? weekColumns : monthColumns;
  const currentData = viewMode === "week" ? weekData : monthData;

  return (
    <div className="right">
      <section className="header">
        <header>
          <strong className="title">
            团队成员贡献日历
            <div className="date">今天是 {formatData(date)}</div>
          </strong>
          <div className="options">
            <Segmented<string>
              options={["周", "月"]}
              value={viewMode === "week" ? "周" : "月"}
              onChange={(value) => {
                setViewMode(value === "周" ? "week" : "month");
              }}
            />
          </div>
        </header>
      </section>
      <section className="content">
        <Table
          columns={currentColumns}
          border={{
            wrapper: true,
            cell: true,
          }}
          data={currentData}
          pagination={false}
          scroll={{ y: 510 }}
        />
      </section>
    </div>
  );
}
