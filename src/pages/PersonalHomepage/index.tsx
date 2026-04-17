import { useState } from "react";
import { Avatar, Progress, Tag } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import styles from "./index.module.less";
import DataCard from "@/components/DataCard";
import Sider from "./Sider";

const taskSummary = [
  { title: "今日待办", value: 7, extra: "2 项高优先级" },
  { title: "已延期", value: 3, extra: "1 项已超过 3 天" },
  { title: "本周截止", value: 11, extra: "周四与周五最集中" },
];

const focusTasks = [
  "支付流程自动化测试补齐",
  "任务筛选交互优化评审",
  "团队周报数据核对与提交",
  "看板权限异常回归验证",
];

const aiAdvice = [
  "先处理支付流程自动化测试补齐（预计 90 分钟）",
  "中午前完成任务筛选交互优化评审（需要跨端确认）",
  "下午集中处理团队周报数据核对与提交（低沟通成本）",
];

const calendarCells = [
  { date: "4/17", count: 3 },
  { date: "4/18", count: 1 },
  { date: "4/19", count: 0 },
  { date: "4/20", count: 2 },
  { date: "4/21", count: 5 },
  { date: "4/22", count: 3 },
  { date: "4/23", count: 4 },
  { date: "4/24", count: 1 },
  { date: "4/25", count: 0 },
  { date: "4/26", count: 2 },
  { date: "4/27", count: 4 },
  { date: "4/28", count: 6 },
  { date: "4/29", count: 2 },
  { date: "4/30", count: 1 },
];

const profileTags = ["前端工程", "任务拆解", "跨团队协作", "自动化推进"];

export type PersonalMenuKey = "workbench" | "profile";

export default function PersonalHomePage() {
  const renderWorkbench = () => (
    <>
      <header className={styles.hero}>
        <div className={styles.heroTitle}>个人工作台</div>
        <p className={styles.heroDesc}>
          聚合你在所有团队中的任务、节奏和风险点，先把今天最重要的 3 件事做完。
        </p>
      </header>

      <section className={styles.topSection}>
        <article className={`${styles.panel} ${styles.taskPanel}`}>
          <div className={styles.panelHead}>
            <h3>我的任务聚合</h3>
            <span>复用看板任务维度</span>
          </div>

          <div className={styles.summaryGrid}>
            {taskSummary.map((item) => (
              <div className={styles.summaryCard} key={item.title}>
                <div className={styles.summaryTitle}>{item.title}</div>
                <div className={styles.summaryValue}>{item.value}</div>
                <div className={styles.summaryExtra}>{item.extra}</div>
              </div>
            ))}
          </div>

          <div className={styles.focusListBlock}>
            <div className={styles.focusTitle}>今日聚焦清单</div>
            <ul className={styles.focusList}>
              {focusTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.dataPanel}`}>
          <div className={styles.panelHead}>
            <h3>我的数据概览</h3>
            <span>复用数据视图指标卡</span>
          </div>

          <div className={styles.metricsGrid}>
            <DataCard
              title="完成率 vs 团队均值"
              data={83}
              unit="%"
              description="本周个人完成率高于团队 9%"
              trend="+9%"
              bcc="linear-gradient(165deg, #eef8ff 0%, #dff0ff 100%)"
            />
            <DataCard
              title="当前负载趋势"
              data={6.4}
              unit="h/天"
              description="近 7 天日均投入工时"
              trend="-6%"
              bcc="linear-gradient(165deg, #f4fff3 0%, #e9fae8 100%)"
            />
          </div>

          <div className={styles.aiAdvice}>
            <div className={styles.aiAdviceTitle}>
              AI 建议：今天优先做这 3 件事
            </div>
            <ol>
              {aiAdvice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </article>
      </section>

      <section className={`${styles.panel} ${styles.calendarPanel}`}>
        <div className={styles.panelHead}>
          <h3>我的日历（简易版）</h3>
          <span>展示任务截止日期分布</span>
        </div>

        <div className={styles.calendarLegend}>
          <span>轻负载</span>
          <span className={styles.level1}>1-2</span>
          <span className={styles.level2}>3-4</span>
          <span className={styles.level3}>5+</span>
        </div>

        <div className={styles.calendarGrid}>
          {calendarCells.map((cell) => {
            const level =
              cell.count >= 5
                ? styles.hot
                : cell.count >= 3
                  ? styles.warm
                  : styles.cool;
            return (
              <div
                className={`${styles.calendarCell} ${level}`}
                key={cell.date}
              >
                <div className={styles.cellDate}>{cell.date}</div>
                <div className={styles.cellCount}>{cell.count} 项</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );

  const renderProfile = () => (
    <>
      <header className={styles.hero}>
        <div className={styles.profileHeader}>
          <Avatar size={56}>
            <IconUser />
          </Avatar>
          <div>
            <div className={styles.heroTitle}>我的信息</div>
            <p className={styles.heroDesc}>个人资料与本周工作状态总览。</p>
          </div>
        </div>
      </header>

      <section className={styles.topSection}>
        <article className={`${styles.panel} ${styles.infoPanel}`}>
          <div className={styles.panelHead}>
            <h3>基础信息</h3>
            <span>静态展示</span>
          </div>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span>姓名</span>
              <strong>张三</strong>
            </div>
            <div className={styles.infoRow}>
              <span>职位</span>
              <strong>前端工程师</strong>
            </div>
            <div className={styles.infoRow}>
              <span>所属团队</span>
              <strong>产品交付组</strong>
            </div>
            <div className={styles.infoRow}>
              <span>邮箱</span>
              <strong>zhangsan@aitaskboard.com</strong>
            </div>
          </div>
          <div className={styles.tagWrap}>
            {profileTags.map((tag) => (
              <Tag key={tag} color="arcoblue">
                {tag}
              </Tag>
            ))}
          </div>
        </article>

        <article className={`${styles.panel} ${styles.dataPanel}`}>
          <div className={styles.panelHead}>
            <h3>本周状态</h3>
            <span>个人绩效节奏</span>
          </div>
          <div className={styles.metricsGrid}>
            <DataCard
              title="任务准时交付率"
              data={92}
              unit="%"
              description="近四周平均水平"
              trend="+4%"
              bcc="linear-gradient(165deg, #effaf0 0%, #e4f8e5 100%)"
            />
            <DataCard
              title="跨团队协作次数"
              data={18}
              unit="次"
              description="本月累计协作"
              trend="+12%"
              bcc="linear-gradient(165deg, #f6f4ff 0%, #efebff 100%)"
            />
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressRow}>
              <span>本周目标完成</span>
              <Progress percent={76} status="normal" />
            </div>
            <div className={styles.progressRow}>
              <span>季度目标推进</span>
              <Progress percent={54} status="normal" />
            </div>
            <div className={styles.progressRow}>
              <span>学习计划执行</span>
              <Progress percent={61} status="normal" />
            </div>
          </div>
        </article>
      </section>
    </>
  );

  const [activeMenu, setActiveMenu] = useState<PersonalMenuKey>("workbench");

  return (
    <div className={styles.personalHomepage}>
      <Sider activeMenu={activeMenu} onChange={setActiveMenu} />
      <main className={styles.content}>
        {activeMenu === "workbench" ? renderWorkbench() : renderProfile()}
      </main>
    </div>
  );
}
