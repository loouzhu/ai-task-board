import { Avatar, Select, Dropdown, Menu } from "@arco-design/web-react";
import {
  IconMoreVertical,
  IconPlus,
  IconEdit,
  IconDelete,
} from "@arco-design/web-react/icon";
import { useSearchParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import type { boardListProps } from "@/types/board";
import "./index.less";

export default function HeaderNav({
  boardList,
  boardMemberList,
}: {
  boardList: boardListProps[];
  boardMemberList: string[];
}) {
  const Option = Select.Option;
  const MenuItem = Menu.Item;
  const AvatarGroup = Avatar.Group;
  const [searchParams, setSearchParams] = useSearchParams();
  const clearTask = useTaskStore((state) => state.setTask);
  const switchBoard = (value: string) => {
    setSearchParams({ boardId: value });
    clearTask(null);
  };

  const dropList = (
    <Menu>
      <MenuItem key="addBoard">
        <IconPlus /> 添加看板
      </MenuItem>
      <MenuItem key="editBoard">
        <IconEdit /> 编辑看板
      </MenuItem>
      <MenuItem key="deleteBoard">
        <IconDelete /> 删除看板
      </MenuItem>
    </Menu>
  );
  return (
    <div className="headerNav">
      <div className="part">
        <div className="title">看板名称：</div>
        <Select
          className="boardList"
          value={searchParams.get("boardId") || boardList?.[0]?.boardId}
          placeholder="暂无看板"
          onChange={switchBoard}
        >
          {boardList?.map((board) => (
            <Option
              value={board.boardId}
              key={board.boardId}
              className="boardItem"
            >
              {board.boardName}
            </Option>
          ))}
        </Select>
        {/* 看板操作 */}
        <div className="boardOptions">
          <Dropdown droplist={dropList}>
            <IconMoreVertical />
          </Dropdown>
        </div>
      </div>
      <div className="part">
        <div className="title">参与研发：</div>
        <AvatarGroup className="memberList" maxCount={3}>
          {boardMemberList &&
            boardMemberList.map((member, index) => (
              <div key={`${member}-${index}`}>
                <Avatar className="member">
                  {member.slice(0, 1).toUpperCase()}
                </Avatar>
              </div>
            ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
