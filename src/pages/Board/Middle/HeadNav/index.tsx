import { Avatar, Select } from "@arco-design/web-react";
import { useSearchParams } from "react-router-dom";
import { useGetBoardInfo } from "@/hooks/useBoard";
import type { boardListProps } from "@/types/board";
import "./index.less";

export default function HeaderNav({
  boardList,
  memberList,
}: {
  boardList: boardListProps[];
  memberList: { userId: string; username: string }[];
}) {
  const Option = Select.Option;
  const AvatarGroup = Avatar.Group;
  const [searchParams, setSearchParams] = useSearchParams();

  const switchBoard = (value: string) => {
    console.log("你选择了", value);
    setSearchParams({ boardId: value });
  };

  const currentBoardInfo = useGetBoardInfo(
    searchParams.get("boardId") || "",
  ).data;
  console.log(currentBoardInfo, "info");

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
      </div>
      <div className="part">
        <div className="title">参与研发：</div>
        <AvatarGroup className="memberList" maxCount={3}>
          {memberList &&
            memberList.map((member, index) => (
              <div key={`${member.userId}-${index}`}>
                <Avatar className="member">
                  {member.username.slice(0, 1).toUpperCase()}
                </Avatar>
              </div>
            ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
