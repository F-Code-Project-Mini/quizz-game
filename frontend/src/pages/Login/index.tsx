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
        <div className="relative min-h-screen overflow-hidden bg-gradient-game">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-purple-500/20 blur-3xl"></div>
                <div
                    className="absolute -right-1/4 top-1/3 h-96 w-96 animate-float rounded-full bg-pink-500/20 blur-3xl"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-0 left-1/3 h-96 w-96 animate-float rounded-full bg-yellow-500/20 blur-3xl"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:py-8">
                {/* Logo & Title */}
                <div className="mb-6 sm:mb-8 animate-scale-in text-center">
                    <div className="mb-3 sm:mb-4 flex justify-center">
                        <div className="rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-2xl">
                            <img src="/logo.svg" alt="Logo" className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                        Đăng nhập
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-white/90">🔐 Quản lý Quiz Game</p>
                </div>

                {/* Login Card */}
                <div className="mx-auto w-full max-w-2xl animate-slide-in-up">
                    <div className="glass-effect-strong rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-1 sm:mb-2 block text-xs sm:text-sm font-bold text-gray-700"
                                >
                                    Tên đăng nhập <span className="text-pink-500">*</span>
                                </label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-11 sm:h-12 border-2 border-gray-300 font-medium transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                                    placeholder="admin"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 sm:mb-2 block text-xs sm:text-sm font-bold text-gray-700"
                                >
                                    Mật khẩu <span className="text-pink-500">*</span>
                                </label>
                                <Input
                                    id="password"
                                    value={password}
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 sm:h-12 border-2 border-gray-300 font-medium transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="fuchsia"
                                size="lg"
                                className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-base sm:text-lg font-bold shadow-glow-pink transition-smooth hover:scale-105 hover:from-purple-700 hover:to-pink-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
