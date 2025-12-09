import publicApi from "~/lib/axios-instance";
import type { ILoginRequest, ILoginResponse } from "~/types/auth.types";

class Auth {
    static login = (data: ILoginRequest) => publicApi.post<ILoginResponse>("/api/auth/login", data);
}
export default Auth;
