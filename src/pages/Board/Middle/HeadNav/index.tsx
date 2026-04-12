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
import { useNavigate, useParams } from "react-router-dom";
import { useTaskStore } from "@/stores/taskStore";
import type { boardListProps } from "@/types/board";
import BoardOptionModal from "@/components/BoardOptionModal";
import { useDeleteBoard } from "@/hooks/useBoard";
import styles from "./index.module.less";

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
  const navigate = useNavigate();
  const { teamId, boardId } = useParams();
  const [createBoardVisible, setCreateBoardVisible] = useState(false);
  const [editBoardVisible, setEditBoardVisible] = useState(false);
  const clearTask = useTaskStore((state) => state.setTask);
  const deleteBoardMutation = useDeleteBoard();
  const currentBoardId = boardId || boardList?.[0]?.boardId;
  const currentBoard =
    boardList.find((board) => board.boardId === currentBoardId) ??
    boardList?.[0];

  const switchBoard = (value: string) => {
    if (!teamId) return;
    navigate(`/team/${teamId}/board/${value}`, { replace: true });
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
          if (teamId) {
            navigate(`/team/${teamId}/board/${nextBoard.boardId}`, {
              replace: true,
            });
          }
          return;
        }
        if (teamId) {
          navigate(`/team/${teamId}/board`, { replace: true });
        }
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
    <div className={styles.headerNav}>
      <div className={styles.part}>
        {/* 看板名称 */}
        <div className={styles.board}>
          <div className={styles.title}>看板名称：</div>
          <Select
            className={styles.boardList}
            value={currentBoardId}
            placeholder="暂无看板"
            onChange={switchBoard}
          >
            {boardList?.map((board) => (
              <Option
                value={board.boardId}
                key={board.boardId}
                className={styles.boardItem}
              >
                {board.boardName}
              </Option>
            ))}
          </Select>
        </div>
        {/* 看板操作 */}
        <div className={styles.boardOptions}>
          <Dropdown droplist={dropList}>
            <IconMoreVertical />
          </Dropdown>
        </div>
      </div>
      <div className={styles.part}>
        <div className={styles.title}>参与研发：</div>
        <AvatarGroup className={styles.memberList} maxCount={3}>
          {boardMemberList &&
            boardMemberList.map((member, index) => (
              <div key={`${member}-${index}`}>
                <Avatar className={styles.member}>
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
