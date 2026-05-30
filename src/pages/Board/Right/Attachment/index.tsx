import styles from "./index.module.less";
import { Button, Message } from "@arco-design/web-react";
import { IconDownload, IconSearch } from "@arco-design/web-react/icon";
import type { TaskFile } from "@/types/task";

interface AttachmentProps {
  files?: TaskFile[];
}

export default function Attachment({ files = [] }: AttachmentProps) {
  const openFileInNewTab = (file: TaskFile) => {
    if (!file.url) {
      Message.warning("当前文件没有可预览的地址");
      return;
    }
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  const downloadFile = async (file: TaskFile) => {
    if (!file.url) {
      Message.warning("当前文件没有可下载的地址");
      return;
    }

    try {
      const response = await fetch(file.url, { credentials: "include" });
      if (!response.ok) {
        Message.error("下载失败，请稍后重试");
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file.filename || file.name || "attachment";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      Message.error("下载失败，请检查网络");
    }
  };

  const downloadAllFiles = async () => {
    for (const file of files) {
      await downloadFile(file);
    }
  };

  return (
    <div className={styles.attachment}>
      <div className={styles.header}>
        <div className={styles.title}>附件</div>
        <Button type="text" size="small" onClick={downloadAllFiles}>
          下载全部
        </Button>
      </div>
      <div className={styles.attachmentContent}>
        {files.length > 0 ? (
          files.map((item, index) => {
            const fileName = item.filename || item.name || `附件${index + 1}`;
            return (
              <div key={`${fileName}-${index}`} className={styles.fileRow}>
                <div className={styles.fileName} title={fileName}>
                  {fileName}
                </div>
                <div className={styles.fileActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => openFileInNewTab(item)}
                    aria-label="预览附件"
                    title="预览"
                  >
                    <IconSearch />
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => downloadFile(item)}
                    aria-label="下载附件"
                    title="下载"
                  >
                    <IconDownload />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div>暂无附件</div>
        )}
      </div>
    </div>
  );
}
