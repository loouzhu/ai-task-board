import "./index.less";
import CardHead from "@/components/CardHead";
import DataCard from "@/components/DataCard";

export default function Left() {
  const dataList = [
    {
      title: "任务总数",
      data: 100,
      unit: "个",
      trend: "12%",
      description: "较上周增加了12%",
      bcc: "linear-gradient(135deg, #ecf3ff 0%, #d9e9ff 100%)",
    },
    {
      title: "完成率",
      data: 80,
      unit: "%",
      trend: "5%",
      description: "本周已经完成30项任务",
      bcc: "linear-gradient(135deg, #e9fbef 0%, #d3f6df 100%)",
    },
    {
      title: "逾期任务",
      data: 4,
      unit: "个",
      trend: "-3.5%",
      description: "高优先级5项",
      bcc: "linear-gradient(135deg, #fff3e8 0%, #ffe2c2 100%)",
    },
    {
      title: "平均负载",
      data: 6.5,
      unit: "个",
      trend: "-10%",
      description: "本周人均任务数量",
      bcc: "linear-gradient(135deg, #f4efff 0%, #e7deff 100%)",
    },
  ];

  const focusList = [
    {
      name: "支付对账异常排查",
      tag: "高优先",
      due: "今天",
    },
    {
      name: "消息中心筛选重构",
      tag: "测试中",
      due: "明天",
    },
    {
      name: "AI 周报自动生成",
      tag: "已逾期",
      due: "2 天前",
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
                <strong>{item.name}</strong>
              </div>
              <div className="focusItem__meta">
                <span className="focusItem__tag">{item.tag}</span>
                <span className="focusItem__due">{item.due}截止</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
