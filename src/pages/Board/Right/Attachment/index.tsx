import styles from "./index.module.less";
import { Button } from "@arco-design/web-react";
import type { TaskFile } from "@/types/task";

interface AttachmentProps {
  files?: TaskFile[];
}

export default function Attachment({ files = [] }: AttachmentProps) {
  const fileList = files;

  return (
    <div className={styles.attachment}>
      <div className={styles.header}>
        <div className={styles.title}>附件</div>
        <Button type="text" size="small">
          下载全部
        </Button>
      </div>
      <div className={styles.attachmentContent}>
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
