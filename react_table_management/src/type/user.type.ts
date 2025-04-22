export interface User {
  id: number | string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  roles: Role[];
}
export interface Role{
    id: number | string;
    name : string
}

export type UserRequest = Omit<User, 'id'>;