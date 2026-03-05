import "./index.less";
import { Button } from "@arco-design/web-react";

export default function Attachment() {
  const fileList = [
    { id: 1, name: "文件1.pdf", size: "1.2 MB" },
    { id: 2, name: "文件2.docx", size: "0.8 MB" },
    { id: 3, name: "文件3.xlsx", size: "2.5 MB" },
    { id: 4, name: "文件4.pptx", size: "1.8 MB" },
    { id: 5, name: "文件5.txt", size: "0.1 MB" },
    { id: 6, name: "文件6.jpg", size: "3.2 MB" },
    { id: 7, name: "文件7.png", size: "2.1 MB" },
    { id: 8, name: "文件8.gif", size: "4.5 MB" },
  ];
  return (
    <div className="attachment">
      <div className="header">
        <div className="title">附件</div>
        <Button type="primary" size="small">
          下载全部
        </Button>
      </div>
      <div className="attachmentContent">
        {fileList &&
          fileList.map((item) => (
            <div key={item.id}>
              {item.name} ({item.size})
            </div>
          ))}
      </div>
    </div>
  );
}
