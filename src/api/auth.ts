interface RegisterUserData {
  username: string;
  password: string;
}

export const register = async (
  userData: RegisterUserData,
  signal?: AbortSignal,
) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    signal,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "注册失败");
  }
  return data;
};

export const login = async (
  userData: RegisterUserData,
  signal?: AbortSignal,
) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    signal,
    // 允许接收和发送cookie
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("用户不存在");
    }
    if (response.status === 401) {
      throw new Error("用户名和密码不匹配");
    }
    throw new Error(data.message || "登陆失败 ");
  }
  return data;
};

export const queryMe = async () => {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (!response.ok) return null;
  return response.json();
};

export const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  if (response.ok) return { success: true };
  const data = await response.json().catch(() => ({}));
  throw new Error(data.message || "登出失败");
};
