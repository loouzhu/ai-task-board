import { Layout } from "@arco-design/web-react";
import Head from "./Head";
import Tag from "./Tag";
import Describe from "./Describe";
import TaskList from "./TaskList";
import Attachment from "./Attachment";
import { useTaskStore } from "@/stores/taskStore";
import styles from "./index.module.less";

export default function RightSide() {
  const Sider = Layout.Sider;
  const task = useTaskStore((state) => state.task);

  return (
    <Sider className={styles.rightSide}>
      <div className={styles.content}>
        <Head
          taskNumber={task?.taskNumber}
          taskName={task?.taskName}
          taskStatus={task?.taskStatus}
        />
        <Tag
          assigneeName={task?.assigneeName || task?.assigneeId}
          taskDeadline={task?.taskDeadline}
          taskPriority={task?.taskPriority}
          taskWorkTime={task?.taskWorkTime}
        />
        <Describe
          taskDescription={task?.taskDescription}
          participantNames={
            task
              ? [
                  task.assigneeName || task.assigneeId,
                  ...task.collaboratorNames,
                ].filter(Boolean)
              : []
          }
        />
        <TaskList subtasks={task?.subtask} />
        <Attachment files={task?.files} />
      </div>
    </Sider>
  );
}
