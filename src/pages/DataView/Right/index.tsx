import "./index.less";
import { Table } from "@arco-design/web-react";

export default function Right() {
  return (
    <div className="right">
      <section className="content">
        <header className="tableHeader">
          <strong className="title">团队成员贡献日历</strong>
          <div className="options">
            切换
            <span className="week">周</span>/<span className="month">月</span>
          </div>
        </header>
        <Table></Table>
      </section>
    </div>
  );
}
