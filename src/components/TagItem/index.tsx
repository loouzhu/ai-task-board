import "./index.less"

export interface TagItemProps {
  key: string;
  title: string;
  data: string;
}

export default function TagItem({key, title, data }: TagItemProps) {
  return (
    <span className="tagItem" key={key} title={data}>
      {title}：{data}
    </span>
  );
}
