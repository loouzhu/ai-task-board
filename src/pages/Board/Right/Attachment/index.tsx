import "./index.less";
import { Button } from "@arco-design/web-react";

interface AttachmentFile {
  name?: string;
  size?: string;
  fileName?: string;
}

interface AttachmentProps {
  files?: unknown[];
}

export default function Attachment({ files = [] }: AttachmentProps) {
  const fileList = files as AttachmentFile[];

  return (
    <div className="attachment">
      <div className="header">
        <div className="title">附件</div>
        <Button type="text" size="small">
          下载全部
        </Button>
      </div>
      <div className="attachmentContent">
        {fileList.length > 0 ? (
          fileList.map((item, index) => (
            <div key={`${item.name || item.fileName || "file"}-${index}`}>
              {item.name || item.fileName || `附件${index + 1}`}
              {item.size ? ` (${item.size})` : ""}
            </div>
          ))
        ) : (
          <div>暂无附件</div>
        )}
      </div>
    </div>
  );
}
