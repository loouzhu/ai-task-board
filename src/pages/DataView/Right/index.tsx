import "./index.less";
import { Table } from "@arco-design/web-react";
import { formatData } from "@/utils/common";
import { useGetAllUsers } from "@/hooks/useUser";
import { Segmented } from "antd";
import DateCell from "@/components/DateCell";

export default function Right({
  dateType,
  setDateType,
}: {
  dateType: "week" | "month";
  setDateType: React.Dispatch<React.SetStateAction<"week" | "month">>;
}) {
  const date = new Date();
  const users = useGetAllUsers();

  // 动态生成带 render 的列
  const generateDateColumns = () => {
    const dateConfigs = [
      { date: "4/1", weekday: "周一", dataIndex: "day1", index: 1 },
      { date: "4/2", weekday: "周二", dataIndex: "day2", index: 2 },
      { date: "4/3", weekday: "周三", dataIndex: "day3", index: 3 },
      { date: "4/4", weekday: "周四", dataIndex: "day4", index: 4 },
      { date: "4/5", weekday: "周五", dataIndex: "day5", index: 5 },
      { date: "4/6", weekday: "周六", dataIndex: "day6", index: 6 },
      { date: "4/7", weekday: "周日", dataIndex: "day7", index: 7 },
    ];

    return [
      {
        title: "日期",
        children: dateConfigs.map((config) => ({
          title: (
            <div>
              <div>{config.date}</div>
              <div
                style={{ fontSize: 12, fontWeight: "normal", color: "#86909c" }}
              >
                {config.weekday}
              </div>
            </div>
          ),
          dataIndex: config.dataIndex,
          key: config.dataIndex,
          width: 70,
          align: "center" as const,
          render: (value: number, record: any) => (
            <DateCell value={value} record={record} dayIndex={config.index} />
          ),
        })),
      },
    ];
  };

  const columns = [
    {
      title: "成员名",
      dataIndex: "name",
      fixed: "left" as const,
      width: 100,
      align: "center" as const,
      render: (name: string) => <span>{name}</span>,
    },
    ...generateDateColumns(),
  ];

  const data = [
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
    },
  ];

  return (
    <div className="right">
      <section className="header">
        <header>
          <strong className="title">
            团队成员贡献日历
            <div className="date">今天是 {formatData(date)}</div>
          </strong>
          <div className="options">
            <Segmented
              options={[
                { label: "周", value: "week" },
                { label: "月", value: "month" },
              ]}
              onChange={(value) => {
                setDateType(value as "week" | "month");
              }}
            />
          </div>
        </header>
      </section>
      <section className="content">
        {dateType === "week" ? (
          <Table
            columns={columns}
            border={{
              wrapper: true,
              cell: true,
            }}
            data={data}
            pagination={false}
            scroll={{ x: 700 }}
          />
        ) : null}
      </section>
    </div>
  );
}
