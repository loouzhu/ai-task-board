import { Layout } from "@arco-design/web-react";
import Head from "./Head";
import Tag from "./Tag";
import Describe from "./Describe";
import TaskList from "./TaskList";
import Attachment from "./Attachment";
import { useTaskStore } from "@/stores/taskStore";
import "./index.less";

export default function RightSide() {
  const Sider = Layout.Sider;
  const task = useTaskStore((state) => state.task);

  return (
    <Sider className="rightSide">
      <div className="content">
        <Head
          taskNumber={task?.taskNumber}
          taskName={task?.taskName}
          taskStatus={task?.taskStatus}
        />
        <Tag
          taskMembers={task?.taskMembers}
          taskDeadline={task?.taskDeadline}
          taskPriority={task?.taskPriority}
          taskWorkTime={task?.taskWorkTime}
        />
        <Describe
          taskDescription={task?.taskDescription}
          taskMembers={task?.taskMembers}
        />
        <TaskList subtasks={task?.subtask} />
        <Attachment files={task?.files} />
      </div>
    </Sider>
  );
}
