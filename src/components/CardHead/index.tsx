import "./index.less";

interface CardHeadProps {
  icon?: React.ReactNode;
  title: string;
  to?: string;
  toIcon?: React.ReactNode;
}

export default function CardHead({ icon, title, to, toIcon }: CardHeadProps) {
  return (
    <div className="cardHead">
      {icon && <div className="icon">{icon}</div>}
      <div className="title">{title}</div>
      {to && <a href={to}>{toIcon}</a>}
    </div>
  );
}
