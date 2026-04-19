import styles from "./index.module.less";
import { Avatar, Select, Form, Button, Input } from "@arco-design/web-react";
import { IconCamera } from "@arco-design/web-react/icon";
import { useEffect } from "react";

export default function PersonalInfo() {
  const [form] = Form.useForm();
  const TextArea = Input.TextArea;
  const FormItem = Form.Item;
  const defaultAvatarUrl =
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp";

  useEffect(() => {
    form.setFieldValue("avatar", defaultAvatarUrl);
  }, [form, defaultAvatarUrl]);

  const handleSubmit = () => {
    const allValues = form.getFieldsValue();
    const payload = {
      ...allValues,
      avatar: form.getFieldValue("avatar") || defaultAvatarUrl,
    };
    console.log("所有值:", payload);
  };

  return (
    <div className={styles.personalInfo}>
      <header>
        <h2>个人资料</h2>
      </header>
      <div className={styles.section}>
        <section className={styles.baseInfoCard}>
          <div className={styles.cardTitle}>基础信息</div>
          <Form
            className={styles.formGrid}
            form={form}
            initialValues={{
              avatar: defaultAvatarUrl,
              name: "张宁",
              position: "高级项目经理",
              email: "zhangning@aitaskboard.com",
              province: "北京",
              city: "北京",
              bio: "关注高效协作与稳定交付，擅长将复杂任务拆解为清晰的执行路径，持续优化团队沟通和项目节奏。",
            }}
            onSubmit={handleSubmit}
          >
            {/* 头像 */}
            <div className={`${styles.formItem} ${styles.fullWidth}`}>
              <span className={styles.formLabel}>头像</span>
              <div className={styles.avatarRow} aria-label="用户头像">
                <div className={styles.avatar}>
                  <Avatar triggerIcon={<IconCamera />} triggerType="mask">
                    <img alt="avatar" src={defaultAvatarUrl} />
                  </Avatar>
                </div>
                <FormItem field="avatar" noStyle>
                  <input type="hidden" />
                </FormItem>
              </div>
            </div>
            {/* 姓名 */}
            <div className={styles.formItem}>
              <span className={styles.formLabel}>姓名</span>
              <FormItem field="name" noStyle>
                <Input
                  className={styles.formControl}
                  placeholder="请输入姓名"
                />
              </FormItem>
            </div>
            {/* 职位 */}
            <div className={styles.formItem}>
              <span className={styles.formLabel}>职位</span>
              <FormItem field="position" noStyle>
                <Input
                  className={styles.formControl}
                  placeholder="请输入职位"
                />
              </FormItem>
            </div>
            {/* 邮箱 */}
            <div className={styles.formItem}>
              <span className={styles.formLabel}>邮箱</span>
              <FormItem field="email" noStyle>
                <Input
                  className={styles.formControl}
                  placeholder="请输入邮箱"
                />
              </FormItem>
            </div>
            {/* 地区 */}
            <div className={styles.formItem}>
              <span className={styles.formLabel}>地区</span>
              <div className={styles.region}>
                <FormItem field="province" noStyle>
                  <Select
                    className={styles.formSelect}
                    placeholder="请选择省"
                    options={[{ label: "北京", value: "北京" }]}
                  />
                </FormItem>
                <FormItem field="city" noStyle>
                  <Select
                    className={styles.formSelect}
                    placeholder="请选择市"
                    options={[{ label: "北京", value: "北京" }]}
                  />
                </FormItem>
              </div>
            </div>
            {/* 个人简介 */}
            <div className={`${styles.formItem} ${styles.fullWidth}`}>
              <span className={styles.formLabel}>个人简介</span>
              <FormItem field="bio" noStyle>
                <TextArea
                  className={`${styles.formControl} ${styles.formTextarea}`}
                  placeholder="请输入个人简介"
                />
              </FormItem>
            </div>
            <Button
              htmlType="submit"
              className={`${styles.updateBtn} ${styles.fullWidth}`}
            >
              更新信息
            </Button>
          </Form>
        </section>
        <section>详情</section>
      </div>
    </div>
  );
}
