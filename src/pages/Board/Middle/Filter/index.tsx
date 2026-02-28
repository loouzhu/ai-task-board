import React from "react";
import { useState } from "react";
import {
  Button,
  Select,
  Tag,
  Input,
  Space,
  DatePicker,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
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
      value: "小王",
    },
    {
      id: 2,
      name: "小周",
      value: "小周",
    },
  ];
  const [selectedVal, setSelectedVal] = useState<string>("all");
  const [tags, setTags] = useState<string[]>([""]);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<string | undefined>(undefined);

  function addTag() {
    if (inputValue) {
      tags.push(inputValue);
      setTags(tags);
      setInputValue("");
    }
    setShowInput(false);
  }

  function removeTag(removeTag: string) {
    const newTags = tags.filter((tag) => tag !== removeTag);
    setTags(newTags);
  }

  const cleanFilter = () => {
    setSelectedVal("all");
    setTags([]);
    setDateValue(undefined);
  };

  return (
    <div className="filter">
      <div className="content">
        <div className="allTasks">所有任务（39）</div>
        <div className="manager">
          <span>负责人：</span>
          <Select
            placeholder="全部"
            style={{ width: 100 }}
            value={selectedVal}
            onChange={setSelectedVal}
          >
            {principalList &&
              principalList.map((item) => (
                <Option key={item.id} value={item.value}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>
        <div className="tags">
          <span>标签：</span>
          <Space size={20}>
            {tags
              .filter((tag) => tag !== "")
              .map((tag, index) => {
                return (
                  <Tag
                    key={tag + index}
                    closable={true}
                    onClose={() => removeTag(tag)}
                  >
                    {tag}
                  </Tag>
                );
              })}
            {showInput ? (
              <Input
                autoFocus
                size="mini"
                value={inputValue}
                style={{ width: 84 }}
                onPressEnter={addTag}
                onBlur={addTag}
                onChange={setInputValue}
              />
            ) : (
              tags.length <= 4 && (
                <Tag
                  icon={<IconPlus />}
                  style={{
                    width: 84,
                    backgroundColor: "var(--color-fill-2)",
                    border: "1px dashed var(--color-fill-3)",
                    cursor: "pointer",
                  }}
                  className="add-tag"
                  tabIndex={0}
                  onClick={() => setShowInput(true)}
                  onKeyDown={(e) => {
                    const keyCode = e.keyCode || e.which;
                    if (keyCode === 13) {
                      // enter
                      setShowInput(true);
                    }
                  }}
                >
                  添加标签
                </Tag>
              )
            )}
          </Space>
        </div>
        <div className="deadline">
          <span>截止日期：</span>
          <DatePicker
            style={{ width: 150 }}
            value={dateValue}
            onChange={setDateValue}
          />
        </div>
      </div>
      <div className="options">
        <Button onClick={() => cleanFilter()}>清除筛选</Button>
        <Button>保存视图</Button>
        <Button>智能排序</Button>
        <Button>AI分析</Button>
      </div>
    </div>
  );
}
