import {
  Avatar,
  Select,
  Dropdown,
  Menu,
  Message,
} from "@arco-design/web-react";
import {
  IconMoreVertical,
  IconPlus,
  IconEdit,
  IconDelete,
} from "@arco-design/web-react/icon";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import type { boardListProps } from "@/types/board";
import BoardOptionModal from "@/components/BoardOptionModal";
import { useDeleteBoard } from "@/hooks/useBoard";
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
  const [createBoardVisible, setCreateBoardVisible] = useState(false);
  const [editBoardVisible, setEditBoardVisible] = useState(false);
  const clearTask = useTaskStore((state) => state.setTask);
  const deleteBoardMutation = useDeleteBoard();
  const currentBoardId = searchParams.get("boardId") || boardList?.[0]?.boardId;
  const currentBoard =
    boardList.find((board) => board.boardId === currentBoardId) ??
    boardList?.[0];

  const switchBoard = (value: string) => {
    setSearchParams({ boardId: value });
    clearTask(null);
  };

  const handleDeleteBoard = async () => {
    if (!currentBoard?.boardId) {
      Message.error("暂无可删除的看板");
      return;
    }
    if (deleteBoardMutation.isPending) return;

    const nextBoard = boardList.find(
      (board) => board.boardId !== currentBoard.boardId,
    );

    deleteBoardMutation.mutate(currentBoard.boardId, {
      onSuccess: () => {
        clearTask(null);
        if (nextBoard?.boardId) {
          setSearchParams({ boardId: nextBoard.boardId });
          return;
        }
        setSearchParams({}, { replace: true });
      },
    });
  };

  const dropList = (
    <Menu>
      <MenuItem key="addBoard" onClick={() => setCreateBoardVisible(true)}>
        <IconPlus /> 添加看板
      </MenuItem>
      <MenuItem key="editBoard" onClick={() => setEditBoardVisible(true)}>
        <IconEdit /> 编辑看板
      </MenuItem>
      <MenuItem key="deleteBoard" onClick={handleDeleteBoard}>
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
      {/* 创建任务 */}
      <BoardOptionModal
        type="create"
        visible={createBoardVisible}
        onVisibleChange={setCreateBoardVisible}
      />
      {/* 编辑任务 */}
      <BoardOptionModal
        type="edit"
        board={currentBoard}
        visible={editBoardVisible}
        onVisibleChange={setEditBoardVisible}
      />
    </div>
  );
}
