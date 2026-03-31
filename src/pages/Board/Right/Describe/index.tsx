import "./index.less";

interface DescribeProps {
  taskDescription?: string;
  taskMembers?: string[];
}

export default function Describe({
  taskDescription,
  taskMembers,
}: DescribeProps) {
  return (
    <div className="describe">
      <div className="part">
        <div className="title">任务描述</div>
        <textarea className="detail" value={taskDescription || ""} readOnly />
      </div>
      <div className="part">
        <div className="title">参与研发</div>
        <div className="participants">{taskMembers?.join("、") || "-"}</div>
      </div>
    </div>
  );
}
