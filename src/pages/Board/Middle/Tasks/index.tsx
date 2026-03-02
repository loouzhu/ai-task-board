import React from "react";
import TaskColumn from "@/components/TaskColumn";
import "./index.less";

export default function Tasks() {
  return (
    <div className="tasks">
      <TaskColumn type="waiting" count={1} />
      <TaskColumn type="processing" count={5} />
      <TaskColumn type="testing" count={2} />
      <TaskColumn type="completed" count={4} />
    </div>
  );
}
