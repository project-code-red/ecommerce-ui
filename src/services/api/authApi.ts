import { AuthUser, User } from "@/types/user";
import { LoginInput, RegisterInput } from "@/schemas/authSchemas";
import { users, currentUserId } from "@/mock/users";
import { setCurrentUser } from "@/lib/auth";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: async (data: LoginInput): Promise<{ user: AuthUser; token: string }> => {
    await delay(500);
    const user = users.find((u) => u.email === data.email);
    if (!user || data.password !== "password123") {
      throw new Error("Invalid email or password");
    }
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: `mock-token-${user.id}`,
    };
    setCurrentUser(authUser);
    return { user: authUser, token: authUser.token! };
  },

  register: async (data: RegisterInput): Promise<{ user: AuthUser; token: string }> => {
    await delay(500);
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "user",
      addresses: [],
      paymentMethods: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      token: `mock-token-${newUser.id}`,
    };
    setCurrentUser(authUser);
    return { user: authUser, token: authUser.token! };
  },

  logout: async (): Promise<void> => {
    await delay(200);
    setCurrentUser(null);
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const user = users.find((u) => u.id === currentUserId);
    return user || null;
  },

  googleLogin: async (): Promise<{ user: AuthUser; token: string }> => {
    await delay(500);
    // Mock Google login - just return first user
    const user = users[0];
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: `mock-token-${user.id}`,
    };
    setCurrentUser(authUser);
    return { user: authUser, token: authUser.token! };
  },

  otpLogin: async (phone: string, otp?: string): Promise<{ user: AuthUser; token: string } | { requiresOtp: boolean }> => {
    await delay(500);
    if (!otp) {
      // Mock sending OTP
      return { requiresOtp: true };
    }
    if (otp !== "123456") {
      throw new Error("Invalid OTP");
    }
    const user = users.find((u) => u.phone === phone) || users[0];
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: `mock-token-${user.id}`,
    };
    setCurrentUser(authUser);
    return { user: authUser, token: authUser.token! };
  },
};

