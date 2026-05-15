import {
  Button,
  Input,
  Select,
  DatePicker,
  Message,
} from "@arco-design/web-react";
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import type { taskFilterParams } from "@/types/task";
import { debounce } from "@/utils/common";
const InputSearch = Input.Search;
import styles from "./index.module.less";

interface FilterProps {
  boardMemberList: string[];
  onFilterChange: (params: taskFilterParams) => void;
}

export default function Filter({
  boardMemberList,
  onFilterChange,
}: FilterProps) {
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
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const updateDebouncedSearchValue = useMemo(
    () => debounce((value: string) => setDebouncedSearchValue(value), 300),
    [],
  );

  useEffect(() => {
    onFilterChange({
      filterMember: selectedPrincipal,
      taskPriority:
        selectedPriority && selectedPriority !== "all"
          ? selectedPriority
          : undefined,
      keyword: debouncedSearchValue.trim() || undefined,
      startDate: rangeValue[0],
      endDate: rangeValue[1],
    });
  }, [
    onFilterChange,
    rangeValue,
    debouncedSearchValue,
    selectedPrincipal,
    selectedPriority,
  ]);

  // 清除筛选条件
  const cleanFilter = () => {
    setSelectedPrincipal(undefined);
    setSelectedPriority(undefined);
    setRangeValue([]);
    setPickerValue([]);
    setSearchValue("");
    setDebouncedSearchValue("");
    Message.success({
      content: `筛选条件已清除`,
      showIcon: true,
    });
  };

  return (
    <div className={styles.filter}>
      <div className={styles.manager}>
        <Select
          placeholder="负责人"
          style={{ width: 100 }}
          value={selectedPrincipal}
          onChange={(value) => {
            setSelectedPrincipal(value);
          }}
        >
          <Option key="all" value="all">
            全部
          </Option>
          {boardMemberList &&
            boardMemberList.map((item, index) => (
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
          }}
        >
          <Option key="priority-all" value="all">
            全部
          </Option>
          {priorityList &&
            priorityList.map((item) => (
              <Option key={item.id} value={item.value}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
      <div className={styles.deadline}>
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
      <div className={styles.search}>
        <InputSearch
          allowClear
          placeholder="搜索"
          style={{ width: 180 }}
          value={searchValue}
          onChange={(value) => {
            setSearchValue(value);
            updateDebouncedSearchValue(value);
          }}
        />
      </div>
      <div className={styles.options}>
        <Button onClick={cleanFilter} type="primary">
          清除筛选
        </Button>
      </div>
    </div>
  );
}
