import publicApi from "~/lib/axios-instance";

class Auth {
    static login = ({ username, password }: { username: string; password: string }) =>
        publicApi.post("/api/auth/login", { username, password });
}

export default Auth;
