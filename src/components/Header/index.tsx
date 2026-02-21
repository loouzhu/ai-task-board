import { useState } from "react";
import { Layout } from "@arco-design/web-react";
import { pageList } from "@/types/components";
import "./index.less";

export default function Header() {
  const Header = Layout.Header;
  const [activeIndex, setActiveIndex] = useState(0);
  const handleChangePage = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Header className="headerContent">
      <div className="title">AI智能任务看板</div>
      <div className="list">
        {pageList.map((item, index) => (
          <span
            key={item.name + index}
            className={`listItem ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleChangePage(index)}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div className="userInfo">个人信息界面</div>
    </Header>
  );
}
