import "./index.less";
import CardHead from "@/components/CardHead";
import DataCard from "@/components/DataCard";
import { useGetTaskMetrics } from "@/hooks/useTask";

export default function Left({ dateType }: { dateType: "week" | "month" }) {
  const taskMetrics = useGetTaskMetrics(dateType).data?.metrics;
  const periodLabel = dateType === "week" ? "周" : "月";
  const {
    totalTaskCount,
    completionRate,
    overdueTaskCount,
    completedTaskCount,
    averageTaskLoad,
    overdueMediumHighPriorityCount,
    changes,
  } = taskMetrics ?? {};

  const formatTrend = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "0%";
    }

    const roundedValue = Number(value.toFixed(2));
    return `${roundedValue > 0 ? "+" : ""}${roundedValue}%`;
  };

  const formatChangeText = (value?: number, unit = "个") => {
    if (typeof value !== "number" || Number.isNaN(value) || value === 0) {
      return `较上${periodLabel}持平`;
    }

    const prefix = value > 0 ? "增加" : "减少";
    return `较上${periodLabel}${prefix}${Math.abs(value)}${unit}`;
  };

  const dataList = [
    {
      title: "任务总数",
      data: totalTaskCount ?? 0,
      unit: "个",
      trend: formatTrend(changes?.totalTaskCount?.changePercentage),
      description: `${formatChangeText(changes?.totalTaskCount?.changeValue)}`,
      bcc: "linear-gradient(135deg, #ecf3ff 0%, #d9e9ff 100%)",
    },
    {
      title: "完成率",
      data: completionRate ?? 0,
      unit: "%",
      trend: formatTrend(changes?.completionRate?.changePercentage),
      description: `本${periodLabel}已完成${completedTaskCount ?? 0}项任务`,
      bcc: "linear-gradient(135deg, #e9fbef 0%, #d3f6df 100%)",
    },
    {
      title: "逾期任务",
      data: overdueTaskCount ?? 0,
      unit: "个",
      trend: formatTrend(changes?.overdueTaskCount?.changePercentage),
      description: `中高优先级 ${overdueMediumHighPriorityCount ?? 0} 项`,
      bcc: "linear-gradient(135deg, #fff3e8 0%, #ffe2c2 100%)",
    },
    {
      title: "平均负载",
      data: averageTaskLoad ?? 0,
      unit: "个",
      trend: formatTrend(changes?.averageTaskLoad?.changePercentage),
      description: `${formatChangeText(changes?.averageTaskLoad?.changeValue)}`,
      bcc: "linear-gradient(135deg, #f4efff 0%, #e7deff 100%)",
    },
  ];

  const focusList = [
    {
      name: "支付对账异常排查",
      tag: "高优先",
      deadline: "今天",
      belong: "看板a",
    },
    {
      name: "消息中心筛选重构",
      tag: "测试中",
      deadline: "明天",
      belong: "看板b",
    },
    {
      name: "AI 周报自动生成",
      tag: "已逾期",
      deadline: "2 天前",
      belong: "看板c",
    },
  ];

  return (
    <div className="left">
      <section className="dataOverview">
        <CardHead title="数据总览" />
        <div className="content">
          {dataList &&
            dataList.map((item) => (
              <DataCard
                key={item.title}
                title={item.title}
                data={item.data}
                trend={item.trend}
                unit={item.unit}
                description={item.description}
                bcc={item.bcc}
              />
            ))}
        </div>
      </section>
      <section className="focusOn">
        <CardHead title="重点关注" />
        <div className="content focusList">
          {focusList.map((item) => (
            <article key={item.name} className="focusItem">
              <div className="focusItem__main">
                <strong className="name">{item.name}</strong>
                <p className="belong">{item.belong}</p>
              </div>
              <div className="focusItem__meta">
                <span className="focusItem__tag">{item.tag}</span>
                <span className="focusItem__deadline">{item.deadline}截止</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
