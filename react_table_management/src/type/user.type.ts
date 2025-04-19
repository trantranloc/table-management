export interface Role {
    id: string;
    name: string;
}
export interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    roles: Role[];
}