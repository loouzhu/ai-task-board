interface RegisterUserData {
  username: string;
  password: string;
}

export const register = (userData: RegisterUserData) => {
  // Simulated registration logic
  return fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const login = (userData: RegisterUserData) => {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};