export interface AuthToken {
    token: string;
}
export interface DecodedToken {
    roles: string[];
    userId: string;
    username: string;
    iat: number;
    exp: number;
}
