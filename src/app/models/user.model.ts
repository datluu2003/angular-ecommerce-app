export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string; // password sẽ không được trả về từ API
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
