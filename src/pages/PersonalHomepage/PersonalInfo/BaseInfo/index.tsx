import styles from "./index.module.less";
import {
  Avatar,
  Select,
  Form,
  Button,
  Input,
  Message,
} from "@arco-design/web-react";
import { IconCamera } from "@arco-design/web-react/icon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMeQuery } from "@/hooks/useAuth";
import {
  useAreaCities,
  useAreaProvinces,
  useGetUserInfoById,
  useUpdateUserInfo,
} from "@/hooks/useUser";
import { useParams } from "react-router-dom";
import CardTitle from "@/components/CardTitle";

export default function BaseInfo() {
  const [form] = Form.useForm();
  const userId = useParams().userId || "";
  const meQuery = useMeQuery();
  const updateUserInfoMutation = useUpdateUserInfo();
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    undefined,
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);
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

  const handleAvatarFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Message.error("请选择图片文件");
      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      Message.error("图片大小不能超过 2MB");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        form.setFieldValue("avatar", result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <section className={styles.baseInfoCard}>
      <CardTitle title="基础信息" />
      <Form className={styles.formGrid} form={form} onSubmit={handleSubmit}>
        <div className={`${styles.formItem} ${styles.fullWidth}`}>
          <span className={styles.formLabel}>头像</span>
          <div className={styles.avatarRow} aria-label="用户头像">
            <FormItem shouldUpdate noStyle>
              {() => {
                const avatarValue =
                  form.getFieldValue("avatar") || avatar || defaultAvatarUrl;
                return (
                  <button
                    type="button"
                    className={styles.avatarButton}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <div className={styles.avatar}>
                      <Avatar triggerIcon={<IconCamera />} triggerType="mask">
                        <img alt="avatar" src={avatarValue} />
                      </Avatar>
                    </div>
                  </button>
                );
              }}
            </FormItem>
            <input
              ref={avatarInputRef}
              className={styles.avatarInput}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
            />
            <FormItem field="avatar" noStyle>
              <input type="hidden" />
            </FormItem>
          </div>
        </div>
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
            <Input className={styles.formControl} placeholder="请输入用户名" />
          </FormItem>
        </div>
        <div className={styles.formItem}>
          <span className={styles.formLabel}>姓名</span>
          <FormItem field="name" noStyle>
            <Input className={styles.formControl} placeholder="请输入姓名" />
          </FormItem>
        </div>
        <div className={styles.formItem}>
          <span className={styles.formLabel}>职位</span>
          <FormItem field="position" noStyle>
            <Input className={styles.formControl} placeholder="请输入职位" />
          </FormItem>
        </div>
        <div className={styles.formItem}>
          <span className={styles.formLabel}>邮箱</span>
          <FormItem field="email" noStyle>
            <Input className={styles.formControl} placeholder="请输入邮箱" />
          </FormItem>
        </div>
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
  );
}
