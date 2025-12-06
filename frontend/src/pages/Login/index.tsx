import React, { useState } from 'react';
import type { AxiosError } from 'axios';
import Auth from '~/requests/auth.requests';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e : any) => {
        e.preventDefault();

        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
            return;
        }

        // alert(`Đăng nhập thành công với Username: ${username}`);
        setLoading(true);

        Auth.login({ username, password })
            .then(() => {
                setLoading(false);
                navigate('/dashboard');
            })
            .catch((error : AxiosError) => {
                setLoading(false);
                if (error.status === 401) {
                    alert(error.response?.data as string);
                }
                else if (error.status === 500) {
                    alert('Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.');
                }
            });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[url('https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455632.jpg?semt=ais_hybrid&w=740&q=80')] ">
        {/* Container chính cho form login */}
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl transition-transform duration-500 ease-in-out transform hover:scale-[1.02]">

            {/* Tiêu đề */}
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Đăng nhập</h2>

            {/* Trường Username */}
            <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
            </label>
            <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>

            {/* Trường Password */}
            <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
            </label>
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <button
                type="submit"
                onClick={handleLogin}
                // Vô hiệu hóa nút khi đang loading
                disabled={isLoading}
                className={`w-full py-2 rounded-lg font-semibold transition duration-300 ease-in-out shadow-lg ${
                    isLoading
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed flex items-center justify-center'
                    : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:shadow-xl'
                }`}
                >
                {/* Thay đổi nội dung nút dựa trên state isLoading */}
                {isLoading ? (
                    <>
                    {/* Icon Loading đơn giản bằng SVG (hoặc bạn có thể dùng spinner icon) */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                    </>
                ) : (
                    'Đăng nhập'
                )}
            </button>

            {/* Tùy chọn khác (Optional) */}
            {/* <div className="mt-4 text-center">
                <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition duration-300">
                    Quên mật khẩu?
                </a>
            </div> */}
        </div>
        </div>
    );
};

export default LoginPage;
