interface RegisterUserData {
  username: string;
  password: string;
}

export const register = async (userData: RegisterUserData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // 解析 JSON 响应体
  const data = await response.json();

  // 返回包含状态码和数据的对象
  return {
    status: response.status,
    ...data,
  };
};

export const login = async (userData: RegisterUserData) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // 解析 JSON 响应体
  const data = await response.json();

  // 返回包含状态码和数据的对象
  return {
    status: response.status,
    ...data,
  };
};
