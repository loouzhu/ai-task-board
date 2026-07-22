import styles from "./index.module.less";
import CardHead from "@/components/CardHead";
import DataCard from "@/components/DataCard";
import { useGetTaskMetrics, useGetFocusOnTask } from "@/hooks/useTask";
import { Button, Empty, Message } from "@arco-design/web-react";
import { useParams } from "react-router-dom";
import type { dateType } from "@/types/task";
import { formatDeadline, formatTaskPriority } from "@/utils/common";
import { useId, useState } from "react";
import FocusItem from "@/components/FocusItem";
import { generateAIText } from "@/api/ai";

interface TaskMetricChange {
  changeValue?: number;
  changePercentage?: number;
}

interface TaskMetrics {
  totalTaskCount?: number;
  completionRate?: number;
  overdueTaskCount?: number;
  completedTaskCount?: number;
  averageTaskLoad?: number;
  overdueMediumHighPriorityCount?: number;
  changes?: {
    totalTaskCount?: TaskMetricChange;
    completionRate?: TaskMetricChange;
    overdueTaskCount?: TaskMetricChange;
    averageTaskLoad?: TaskMetricChange;
  };
}

export default function Left({ dateType }: { dateType: dateType }) {
  const { teamId } = useParams();
  const id = useId();
  const taskMetrics = useGetTaskMetrics(dateType, teamId || "").data
    ?.metrics as TaskMetrics | undefined;
  const focusOnTasks = useGetFocusOnTask(teamId || "").data?.tasks ?? [];
  const periodLabel = dateType === "week" ? "周" : "月";
  const [aiSummary, setAiSummary] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
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

  const focusList = focusOnTasks.map((task) => ({
    name: task.taskName,
    tag:
      task.taskPriority === "high" ? "高优先" : task.isOverdue ? "已逾期" : "",
    deadline: formatDeadline(task.taskDeadline),
    belong: task.boardName || "未知看板",
  }));

  const buildAISnapshot = () => {
    const focusTasksForAI = focusOnTasks.slice(0, 8).map((task) => ({
      name: task.taskName,
      priority: formatTaskPriority(task.taskPriority),
      isOverdue: task.isOverdue,
      deadline: task.taskDeadline || "",
      deadlineText: formatDeadline(task.taskDeadline),
      boardName: task.boardName || "未知看板",
    }));

    return {
      period: `本${periodLabel}`,
      metrics: {
        totalTaskCount: totalTaskCount ?? 0,
        completionRate: completionRate ?? 0,
        overdueTaskCount: overdueTaskCount ?? 0,
        completedTaskCount: completedTaskCount ?? 0,
        averageTaskLoad: averageTaskLoad ?? 0,
        overdueMediumHighPriorityCount: overdueMediumHighPriorityCount ?? 0,
      },
      changes: changes ?? {},
      focusTasks: focusTasksForAI,
    };
  };

  const handleCopy = async (content: string) => {
    if (!content) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      Message.success("已复制到剪贴板");
    } catch {
      Message.error("复制失败");
    }
  };

  const runAI = async (mode: "summary" | "analysis") => {
    if (mode === "summary" && summaryLoading) {
      return;
    }

    if (mode === "analysis" && analysisLoading) {
      return;
    }

    if (!teamId) {
      Message.info("请先选择团队");
      return;
    }

    if (!taskMetrics && focusOnTasks.length === 0) {
      Message.info("暂无可用于 AI 生成的数据");
      return;
    }

    const snapshot = buildAISnapshot();
    const dataText = JSON.stringify(snapshot, null, 2);
    const systemPrompt =
      mode === "summary"
        ? "你是项目管理数据分析助手，输出正式、简洁、条目化的团队周报摘要。"
        : "你是项目管理数据分析师，输出正式、客观的风险分析与建议。";
    const userPrompt =
      mode === "summary"
        ? `请基于以下数据生成${periodLabel}度简报：\n1) 先给标题\n2) 3-5条要点（完成率、逾期、负载、风险等）\n3) 不要编造数据\n4) 重点关注为空时请说明暂无重点关注\n\n数据：\n${dataText}`
        : `请基于以下数据生成${periodLabel}度分析：\n1) 分为“风险”和“建议”两部分\n2) 每部分2-4条\n3) 不要编造数据\n\n数据：\n${dataText}`;

    if (mode === "summary") {
      setSummaryLoading(true);
    } else {
      setAnalysisLoading(true);
    }

    try {
      const content = await generateAIText({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      });

      if (mode === "summary") {
        setAiSummary(content);
      } else {
        setAiAnalysis(content);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI 生成失败";
      Message.error(message);
    } finally {
      if (mode === "summary") {
        setSummaryLoading(false);
      } else {
        setAnalysisLoading(false);
      }
    }
  };

  const AISummary = () => {
    void runAI("summary");
  };

  const AIAnalysis = () => {
    void runAI("analysis");
  };

  return (
    <div className={styles.left}>
      <section className={styles.dataOverview}>
        <CardHead
          title="数据总览"
          AIOptionFn={AISummary}
          AIOptionName="AI简报"
        />
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
        {(summaryLoading || aiSummary) && (
          <div className={styles.aiPanel}>
            <div className={styles.aiPanelHeader}>
              <span className={styles.aiPanelTitle}>AI简报</span>
              <Button
                size="mini"
                type="secondary"
                onClick={() => handleCopy(aiSummary)}
                disabled={!aiSummary}
              >
                复制
              </Button>
            </div>
            <div className={styles.aiPanelBody}>
              {summaryLoading ? "生成中..." : aiSummary}
            </div>
          </div>
        )}
      </section>
      <section className={styles.focusOn}>
        <CardHead
          title="重点关注"
          AIOptionName="AI分析"
          AIOptionFn={AIAnalysis}
        />
        <div className={`${styles.content} ${styles.focusList}`}>
          {focusList.length > 0 ? (
            focusList.map((item) => (
              <FocusItem item={item} key={`${id}-${item.name}`} />
            ))
          ) : (
            <Empty description="暂无重点关注数据" />
          )}
        </div>
        {(analysisLoading || aiAnalysis) && (
          <div className={styles.aiPanel}>
            <div className={styles.aiPanelHeader}>
              <span className={styles.aiPanelTitle}>AI分析</span>
              <Button
                size="mini"
                type="secondary"
                onClick={() => handleCopy(aiAnalysis)}
                disabled={!aiAnalysis}
              >
                复制
              </Button>
            </div>
            <div className={styles.aiPanelBody}>
              {analysisLoading ? "生成中..." : aiAnalysis}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
