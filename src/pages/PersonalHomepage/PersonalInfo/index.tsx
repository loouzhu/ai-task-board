import styles from "./index.module.less";
import { Avatar, Select, Form, Button, Input } from "@arco-design/web-react";
import { IconCamera } from "@arco-design/web-react/icon";
import { useEffect, useMemo, useState } from "react";
import { useMeQuery } from "@/hooks/useAuth";
import {
  useAreaCities,
  useAreaProvinces,
  useGetUserInfoById,
  useUpdateUserInfo,
} from "@/hooks/useUser";
import { useParams } from "react-router-dom";

export default function PersonalInfo() {
  const [form] = Form.useForm();
  const userId = useParams().userId || "";
  const meQuery = useMeQuery();
  const updateUserInfoMutation = useUpdateUserInfo();
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    undefined,
  );
  const TextArea = Input.TextArea;
  const { avatar, username, name, position, email, province, city, bio } =
    useGetUserInfoById(userId).data?.userInfo || {};
  const provincesQuery = useAreaProvinces();
  const currentProvince = selectedProvince ?? province ?? "";
  const citiesQuery = useAreaCities(currentProvince);
  const FormItem = Form.Item;
  const defaultAvatarUrl =
    "//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp";

  useEffect(() => {
    form.setFieldValue("avatar", defaultAvatarUrl);
  }, [form, defaultAvatarUrl]);

  useEffect(() => {
    if (meQuery.data?.username) {
      form.setFieldValue("username", meQuery.data.username);
    }
  }, [form, meQuery.data?.username]);

  useEffect(() => {
    form.setFieldsValue({
      avatar: avatar || defaultAvatarUrl,
      username: meQuery.data?.username || username || "",
      name: name || "",
      position: position || "",
      email: email || "",
      province: province || "",
      city: city || "",
      bio: bio || "",
    });
  }, [
    avatar,
    bio,
    city,
    defaultAvatarUrl,
    email,
    form,
    meQuery.data?.username,
    name,
    position,
    province,
    username,
  ]);

  const provinceOptions = useMemo(() => {
    const list = provincesQuery.data?.provinces || provincesQuery.data || [];
    return Array.isArray(list)
      ? list.map((item: string) => ({ label: item, value: item }))
      : [];
  }, [provincesQuery.data]);

  const cityOptions = useMemo(() => {
    const list = citiesQuery.data?.cities || citiesQuery.data || [];
    return Array.isArray(list)
      ? list.map((item: string) => ({ label: item, value: item }))
      : [];
  }, [citiesQuery.data]);

  const handleSubmit = () => {
    const allValues = form.getFieldsValue();
    const payload = {
      ...allValues,
      avatar: form.getFieldValue("avatar") || defaultAvatarUrl,
      username: form.getFieldValue("username"),
    };
    if (updateUserInfoMutation.isPending) return;
    updateUserInfoMutation.mutate({ userId, userData: payload });
  };

  return (
    <div className={styles.personalInfo}>
      <header>
        <h2>个人资料</h2>
      </header>
      <div className={styles.section}>
        <section className={styles.baseInfoCard}>
          <div className={styles.cardTitle}>基础信息</div>
          <Form className={styles.formGrid} form={form} onSubmit={handleSubmit}>
            {/* 头像 */}
            <div className={`${styles.formItem} ${styles.fullWidth}`}>
              <span className={styles.formLabel}>头像</span>
              <div className={styles.avatarRow} aria-label="用户头像">
                <div className={styles.avatar}>
                  <Avatar triggerIcon={<IconCamera />} triggerType="mask">
                    <img alt="avatar" src={avatar || defaultAvatarUrl} />
                  </Avatar>
                </div>
                <FormItem field="avatar" noStyle>
                  <input type="hidden" />
                </FormItem>
              </div>
            </div>
            {/* 用户名 */}
            <div className={styles.formItem}>
              <span className={styles.formLabel}>用户名</span>
              <FormItem
                field="username"
                noStyle
                required
                rules={[
                  { required: true, message: "请输入用户名" },
                  {
                    validator: (
                      value: string | undefined,
                      callback: (error?: React.ReactNode) => void,
                    ) => {
                      if (!value) {
                        callback();
                        return;
                      }
                      if (value.length < 3 || value.length > 8) {
                        callback("用户名长度需为 3-8 位");
                        return;
                      }
                      callback();
                    },
                  },
                ]}
              >
                <Input
                  className={styles.formControl}
                  placeholder="请输入用户名"
                />
              </FormItem>
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
                    options={provinceOptions}
                    loading={provincesQuery.isLoading}
                    onChange={(value) => {
                      const nextProvince = String(value || "");
                      setSelectedProvince(nextProvince);
                      form.setFieldValue("city", undefined);
                    }}
                  />
                </FormItem>
                <FormItem field="city" noStyle>
                  <Select
                    className={styles.formSelect}
                    placeholder="请选择市"
                    options={cityOptions}
                    loading={citiesQuery.isLoading}
                    disabled={!currentProvince}
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
