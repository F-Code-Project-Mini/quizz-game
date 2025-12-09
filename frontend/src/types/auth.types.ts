export interface ILoginRequest {
    username: string;
    password: string;
}
export interface ILoginResponse {
    success: boolean;
    message: string;
}
