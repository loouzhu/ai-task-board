import styles from "./index.module.less";
import CardHead from "@/components/CardHead";
import DataCard from "@/components/DataCard";
import { useGetTaskMetrics, useGetFocusOnTask } from "@/hooks/useTask";
import { Empty } from "@arco-design/web-react";
import { useParams } from "react-router-dom";
import type { dateType } from "@/types/task";
import { formatDeadline } from "@/utils/common";
import FocusItem from "@/components/FocusItem";

export default function Left({ dateType }: { dateType: dateType }) {
  const { teamId } = useParams();
  const taskMetrics = useGetTaskMetrics(dateType, teamId || "").data?.metrics;
  const focusOnTasks = useGetFocusOnTask(teamId || "").data?.tasks;
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
      bcc: "var(--overview-card-1-bg)",
    },
    {
      title: "完成率",
      data: completionRate ?? 0,
      unit: "%",
      trend: formatTrend(changes?.completionRate?.changePercentage),
      description: `本${periodLabel}已完成${completedTaskCount ?? 0}项任务`,
      bcc: "var(--overview-card-2-bg)",
    },
    {
      title: "逾期任务",
      data: overdueTaskCount ?? 0,
      unit: "个",
      trend: formatTrend(changes?.overdueTaskCount?.changePercentage),
      description: `中高优先级 ${overdueMediumHighPriorityCount ?? 0} 项`,
      bcc: "var(--overview-card-3-bg)",
    },
    {
      title: "平均负载",
      data: averageTaskLoad ?? 0,
      unit: "个",
      trend: formatTrend(changes?.averageTaskLoad?.changePercentage),
      description: `${formatChangeText(changes?.averageTaskLoad?.changeValue)}`,
      bcc: "var(--overview-card-4-bg)",
    },
  ];

  const focusList =
    focusOnTasks?.map((task) => ({
      name: task.taskName,
      tag:
        task.taskPriority === "high"
          ? "高优先"
          : task.isOverdue
            ? "已逾期"
            : "",
      deadline: formatDeadline(task.taskDeadline),
      belong: task.boardName || "未知看板",
    })) || [];

  return (
    <div className={styles.left}>
      <section className={styles.dataOverview}>
        <CardHead title="数据总览" />
        <div className={styles.content}>
          {dataList ? (
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
            ))
          ) : (
            <Empty description="暂无数据" />
          )}
        </div>
      </section>
      <section className={styles.focusOn}>
        <CardHead title="重点关注" />
        <div className={`${styles.content} ${styles.focusList}`}>
          {focusList.length > 0 ? (
            focusList.map((item) => <FocusItem item={item} />)
          ) : (
            <Empty description="暂无重点关注数据" />
          )}
        </div>
      </section>
    </div>
  );
}
