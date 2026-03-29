import {
  Button,
  Input,
  Select,
  DatePicker,
  Message,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import type { taskFilterParams } from "@/types/task";
const InputSearch = Input.Search;
import "./index.less";

interface FilterProps {
  memberList: string[];
  onFilterChange: (params: taskFilterParams) => void;
}

export default function Filter({ memberList, onFilterChange }: FilterProps) {
  const Option = Select.Option;
  const priorityList = [
    {
      id: 0,
      name: "全部",
      value: "all",
    },
    {
      id: 1,
      name: "低",
      value: "low",
    },
    {
      id: 2,
      name: "中",
      value: "medium",
    },
    {
      id: 3,
      name: "高",
      value: "high",
    },
  ];
  const [rangeValue, setRangeValue] = useState<[string, string] | []>([]);
  const [pickerValue, setPickerValue] = useState<Dayjs[]>([]);
  const [selectedPrincipal, setSelectedPrincipal] = useState<
    string | undefined
  >(undefined);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(
    undefined,
  );
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    onFilterChange({
      member: selectedPrincipal,
      taskPriority: selectedPriority,
      deadlineRange: rangeValue,
      keyword: searchValue.trim(),
    });
  }, [
    selectedPrincipal,
    selectedPriority,
    rangeValue,
    searchValue,
    onFilterChange,
  ]);

  // 清除筛选条件
  const cleanFilter = () => {
    setSelectedPrincipal(undefined);
    setSelectedPriority(undefined);
    setRangeValue([]);
    setPickerValue([]);
    setSearchValue("");
    Message.success({
      content: `筛选条件已清除`,
      showIcon: true,
    });
  };

  return (
    <div className="filter">
      <div className="manager">
        <Select
          placeholder="负责人"
          style={{ width: 100 }}
          value={selectedPrincipal}
          onChange={(value) => {
            setSelectedPrincipal(value);
            Message.info({
              content: `You select ${value}.`,
              showIcon: true,
            });
          }}
        >
          <Option key="all" value="all">
            全部
          </Option>
          {memberList &&
            memberList.map((item, index) => (
              <Option key={`member-${index}`} value={item}>
                {item}
              </Option>
            ))}
        </Select>
        <Select
          placeholder="优先级"
          style={{ width: 100 }}
          value={selectedPriority}
          onChange={(value) => {
            setSelectedPriority(value);
            Message.info({
              content: `You select ${value}.`,
              showIcon: true,
            });
          }}
        >
          {priorityList &&
            priorityList.map((item) => (
              <Option key={item.id} value={item.value}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
      <div className="deadline">
        <DatePicker.RangePicker
          style={{ width: 256 }}
          value={pickerValue}
          onChange={(dateStrings, value) => {
            setPickerValue(value ?? []);
            if (
              Array.isArray(dateStrings) &&
              dateStrings.length === 2 &&
              dateStrings[0] &&
              dateStrings[1]
            ) {
              setRangeValue([dateStrings[0], dateStrings[1]]);
              return;
            }

            setRangeValue([]);
          }}
          allowClear={true}
        />
      </div>
      <div className="search">
        <InputSearch
          allowClear
          placeholder="搜索"
          style={{ width: 180 }}
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
          onSearch={(value) => {
            Message.info({
              content: `搜索: ${value}`,
              showIcon: true,
            });
          }}
        />
      </div>
      <div className="options">
        <Button onClick={cleanFilter} type="primary">
          清除筛选
        </Button>
      </div>
    </div>
  );
}
