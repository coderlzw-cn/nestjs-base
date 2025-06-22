export interface IUser {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  nickname?: string;
  isActive?: boolean;
}

export interface IUserResponse {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
