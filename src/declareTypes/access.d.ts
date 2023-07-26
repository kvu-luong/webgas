export type SignUp = {
  name: string;
  email: string;
  password: string;
};

export type Login = {
  email: string;
  password: string;
  refreshToken?: string | null;
};

export type ShopFields = {
  email?: number;
  password?: number;
  name?: number;
  status?: number;
  roles?: number;
};

export type Payload = {
  userId: string;
};
