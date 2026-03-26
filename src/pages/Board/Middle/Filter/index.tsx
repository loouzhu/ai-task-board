import {
  Button,
  Input,
  Select,
  DatePicker,
  Message,
} from "@arco-design/web-react";
import { useState } from "react";
const InputSearch = Input.Search;
import "./index.less";

export default function Filter() {
  const Option = Select.Option;

  const principalList = [
    {
      id: 0,
      name: "全部",
      value: "all",
    },
    {
      id: 1,
      name: "小王",
      value: "wang",
    },
    {
      id: 2,
      name: "小周",
      value: "zhou",
    },
  ];
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

  // const today = new Date();
  const [rangeValue, setRangeValue] = useState<(Date | string)[]>([]);
  const [selectedPrincipal, setSelectedPrincipal] = useState<
    string | undefined
  >(undefined);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(
    undefined,
  );
  const [searchValue, setSearchValue] = useState("");

  // 清除筛选条件
  const cleanFilter = () => {
    setSelectedPrincipal(undefined);
    setSelectedPriority(undefined);
    setRangeValue([]);
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
          {principalList &&
            principalList.map((item) => (
              <Option key={item.id} value={item.value}>
                {item.name}
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
          value={rangeValue}
          onChange={(v) => setRangeValue(v)}
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
