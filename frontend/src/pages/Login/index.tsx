import { useState } from "react";
import type { AxiosError } from "axios";
import Auth from "~/requests/auth.requests";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { ILoginRequest, ILoginResponse } from "~/types/auth.types";
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: ({ username, password }: ILoginRequest) => Auth.login({ username, password }),
        onSuccess: () => {
            Swal.fire({
                title: "Đăng nhập thành công",
                text: "Bạn đã đăng nhập thành công vào hệ thống.",
                icon: "success",
            });
            navigate("/dashboard");
        },
        onError: (error: AxiosError<ILoginResponse>) => {
            Swal.fire({
                title: "Đăng nhập thất bại",
                text: error.response?.data.message || "Đã có lỗi xảy ra trong quá trình đăng nhập.",
                icon: "error",
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const handleLogin = (e: any) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu thông tin",
                text: "Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.",
            });

            return;
        }

        setLoading(true);

        loginMutation.mutate({ username, password });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[url('https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455632.jpg?semt=ais_hybrid&w=740&q=80')] bg-cover bg-center py-4">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Đăng nhập</h2>

                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                    </label>
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border-gray-300 py-3 font-medium transition-all focus:ring-2 focus:ring-fuchsia-500"
                        placeholder="Nhập tên đăng nhập"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu
                    </label>
                    <Input
                        id="password"
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-gray-300 py-3 font-medium transition-all focus:ring-2 focus:ring-fuchsia-500"
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </div>

                <Button variant={"fuchsia"} className="w-full" disabled={isLoading} onClick={handleLogin}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
};

export default LoginPage;
