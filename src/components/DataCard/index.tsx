import { IconArrowFall, IconArrowRise } from "@arco-design/web-react/icon";
import "./index.less";

interface dataCardProps {
  title: string;
  data: number;
  unit?: string;
  description: string;
  trend: string;
  bcc?: string;
}

export default function DataCard({
  title,
  data,
  unit,
  description,
  trend,
  bcc = "",
}: dataCardProps) {
  const isNegativeTrend = trend.trim().startsWith("-");

  return (
    <div className="dataCard" style={bcc ? { background: bcc } : undefined}>
      <div className="title">{title}</div>
      <div className="dataCard__meta">
        <div className="data">
          <div className="data__main">
            <span className="value" title={data.toString()}>
              {data}
            </span>
            {unit && <span className="unit" title={unit}>{unit}</span>}
          </div>
          <span
            className={`trendTag ${isNegativeTrend ? "trendTag--down" : "trendTag--up"}`}
          >
            {isNegativeTrend ? <IconArrowFall /> : <IconArrowRise />}
            <span className="trendText">{trend}</span>
          </span>
        </div>
      </div>
      <div className="description">{description}</div>
    </div>
  );
}
