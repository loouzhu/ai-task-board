import { IconArrowFall, IconArrowRise } from "@arco-design/web-react/icon";
import styles from "./index.module.less";

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
    <div className={styles.dataCard} style={bcc ? { background: bcc } : undefined}>
      <div className={styles.title}>{title}</div>
      <div className={styles.dataCard__meta}>
        <div className={styles.data}>
          <div className={styles.data__main}>
            <span className={styles.value} title={data.toString()}>
              {data}
            </span>
            {unit && <span className={styles.unit} title={unit}>{unit}</span>}
          </div>
          <span
            className={`${styles.trendTag} ${isNegativeTrend ? styles["trendTag--down"] : styles["trendTag--up"]}`}
          >
            {isNegativeTrend ? <IconArrowFall /> : <IconArrowRise />}
            <span className={styles.trendText}>{trend}</span>
          </span>
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
