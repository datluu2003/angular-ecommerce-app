export interface User {
  _id?: string;
  Username: string; // Match với backend API
  username?: string; // Alias để backward compatibility
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  avatar?: string;
  role: 'admin' | 'member';
  password?: string; // password sẽ không được trả về từ API
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  exp: number;
  iat: number;
}
