import "./index.less";
import { Table, Tag } from "@arco-design/web-react";
import { formatData } from "@/utils/common";
//import { useGetAllUsers } from "@/hooks/useUser";
import { Segmented } from "antd";
import DateCell from "@/components/DayCell";
import WeekCell from "@/components/WeekCell";
import type { MonthDataRecord, WeekDataRecord } from "@/types/dataView";

export default function Right({
  dateType,
  setDateType,
}: {
  dateType: "week" | "month";
  setDateType: (type: "week" | "month") => void;
}) {
  const date = new Date();

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
          <span style={{ fontWeight: 500, cursor: "pointer" }}>{name}</span>
          <div style={{ fontSize: 12, color: "#86909c", marginTop: 4 }}>
            总计: {record.weekTotal || 0}个
          </div>
        </div>
      ),
    },
    {
      title: "4/1 (周一)",
      dataIndex: "monday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["monday"]) => <DateCell dayData={value} />,
    },
    {
      title: "4/2 (周二)",
      dataIndex: "tuesday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["tuesday"]) => (
        <DateCell dayData={value} />
      ),
    },
    {
      title: "4/3 (周三)",
      dataIndex: "wednesday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["wednesday"]) => (
        <DateCell dayData={value} />
      ),
    },
    {
      title: "4/4 (周四)",
      dataIndex: "thursday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["thursday"]) => (
        <DateCell dayData={value} />
      ),
    },
    {
      title: "4/5 (周五)",
      dataIndex: "friday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["friday"]) => <DateCell dayData={value} />,
    },
    {
      title: "4/6 (周六)",
      dataIndex: "saturday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["saturday"]) => (
        <DateCell dayData={value} />
      ),
    },
    {
      title: "4/7 (周日)",
      dataIndex: "sunday",
      width: 60,
      align: "center" as const,
      render: (value: WeekDataRecord["sunday"]) => <DateCell dayData={value} />,
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
      monday: { task: 2, blocked: false, delay: true },
      tuesday: { task: 3, blocked: true, delay: false },
      wednesday: { task: 1, blocked: false, delay: true },
      thursday: { task: 4, blocked: false, delay: false },
      friday: { task: 5, blocked: false, delay: false },
      saturday: { task: 0, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 15,
    },
    {
      key: "2",
      name: "李四",
      monday: { task: 1, blocked: false, delay: false },
      tuesday: { task: 2, blocked: true, delay: false },
      wednesday: { task: 3, blocked: false, delay: false },
      thursday: { task: 0, blocked: false, delay: false },
      friday: { task: 2, blocked: false, delay: false },
      saturday: { task: 0, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 8,
    },
    {
      key: "3",
      name: "王五",
      monday: { task: 0, blocked: false, delay: false },
      tuesday: { task: 1, blocked: false, delay: false },
      wednesday: { task: 0, blocked: false, delay: false },
      thursday: { task: 1, blocked: false, delay: false },
      friday: { task: 0, blocked: false, delay: false },
      saturday: { task: 0, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 2,
    },
    {
      key: "4",
      name: "赵六",
      monday: { task: 3, blocked: false, delay: false },
      tuesday: { task: 2, blocked: false, delay: false },
      wednesday: { task: 4, blocked: true, delay: true },
      thursday: { task: 2, blocked: false, delay: false },
      friday: { task: 3, blocked: false, delay: false },
      saturday: { task: 1, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 15,
    },
    {
      key: "5",
      name: "小明",
      monday: { task: 1, blocked: false, delay: false },
      tuesday: { task: 0, blocked: false, delay: false },
      wednesday: { task: 2, blocked: false, delay: false },
      thursday: { task: 1, blocked: false, delay: false },
      friday: { task: 0, blocked: false, delay: false },
      saturday: { task: 0, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 4,
    },
    {
      key: "6",
      name: "小红",
      monday: { task: 2, blocked: false, delay: false },
      tuesday: { task: 2, blocked: false, delay: false },
      wednesday: { task: 2, blocked: true, delay: false },
      thursday: { task: 2, blocked: false, delay: false },
      friday: { task: 2, blocked: false, delay: false },
      saturday: { task: 0, blocked: false, delay: false },
      sunday: { task: 0, blocked: false, delay: false },
      weekTotal: 10,
    },
  ];

  // 月视图数据（按周聚合 + 月总计）
  const monthData: MonthDataRecord[] = [
    {
      key: "1",
      name: "张三（我）",
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
  const currentColumns = dateType === "week" ? weekColumns : monthColumns;
  const currentData = dateType === "week" ? weekData : monthData;

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
              options={["本周", "本月"]}
              value={dateType === "week" ? "本周" : "本月"}
              onChange={(value) => {
                setDateType(value === "本周" ? "week" : "month");
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
