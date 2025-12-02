import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Zap } from "lucide-react";

interface CountDownProps {
    duration?: number; // Thời gian đếm ngược (giây)
    redirectTo?: string; // Đường dẫn chuyển hướng
    onComplete?: () => void; // Callback khi hoàn thành
    title?: string; // Tiêu đề hiển thị
    show: boolean; // Hiển thị component
}

const CountDown = ({ duration = 5, redirectTo, onComplete, title = "Trò chơi sắp bắt đầu!", show }: CountDownProps) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(duration);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!show) return;

        setCount(duration);
        setIsAnimating(true);

        const timer = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    setTimeout(() => {
                        if (redirectTo) {
                            navigate(redirectTo);
                        }
                        if (onComplete) {
                            onComplete();
                        }
                    }, 500);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [show, duration, redirectTo, onComplete, navigate]);

    if (!show) return null;

    const progress = ((duration - count) / duration) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 h-96 w-96 animate-pulse rounded-full bg-fuchsia-500/20 blur-3xl"></div>
                <div
                    className="absolute -right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8">
                {/* Title */}
                <div className="flex items-center gap-3 text-center">
                    <Zap className="h-8 w-8 animate-pulse text-yellow-400 sm:h-10 sm:w-10" />
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-5xl">{title}</h2>
                    <Zap className="h-8 w-8 animate-pulse text-yellow-400 sm:h-10 sm:w-10" />
                </div>

                {/* Countdown Circle */}
                <div className="relative">
                    {/* Outer Ring */}
                    <svg className="h-48 w-48 -rotate-90 sm:h-64 sm:w-64" viewBox="0 0 200 200">
                        {/* Background Circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="12"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                            style={{
                                transition: "stroke-dashoffset 1s linear",
                            }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="50%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Count Number */}
                        <div
                            className={`text-8xl font-black text-white drop-shadow-2xl transition-transform duration-300 sm:text-9xl ${
                                isAnimating ? "animate-bounce-in" : ""
                            }`}
                            key={count}
                        >
                            {count}
                        </div>

                        {/* Clock Icon */}
                        <Clock className="mt-2 h-6 w-6 animate-pulse text-white/80 sm:h-8 sm:w-8" />
                    </div>

                    {/* Pulse Effect */}
                    <div
                        className="absolute inset-0 animate-ping rounded-full bg-fuchsia-500/30"
                        style={{ animationDuration: "2s" }}
                    ></div>
                </div>

                {/* Message */}
                <p className="text-center text-lg font-medium text-white/90 drop-shadow sm:text-xl">
                    Hãy chuẩn bị sẵn sàng...
                </p>

                {/* Progress Bar */}
                <div className="w-64 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm sm:w-80">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Sparkle Animation */}
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-2 w-2 animate-bounce rounded-full bg-white"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: "0.6s",
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes bounce-in {
                    0% {
                        transform: scale(0.3);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
            `}</style>
        </div>
    );
};

export default CountDown;
