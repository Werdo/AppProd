export interface User {
  id: string;
  name: string;
  role: string;
  employeeId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}
