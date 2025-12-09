import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    onGoHome?: () => void;
}

const ErrorDisplay = ({
    title = "Đã có lỗi xảy ra",
    message = "Xin lỗi, có lỗi không mong muốn đã xảy ra. Vui lòng thử lại.",
    onRetry,
    onGoHome,
}: ErrorDisplayProps) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-game">
            {/* Animated Background */}
            <div className="absolute inset-0">
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
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md animate-scale-in text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 shadow-2xl">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                    </div>

                    {/* Error Card */}
                    <div className="glass-effect-strong rounded-3xl p-8 shadow-2xl">
                        <h1 className="mb-4 text-3xl font-black text-gray-800">{title}</h1>
                        <p className="mb-6 text-base text-gray-600">{message}</p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {onRetry && (
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold shadow-glow-pink transition-smooth hover:scale-105 hover:from-purple-700 hover:to-pink-700"
                                    onClick={onRetry}
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    Thử lại
                                </Button>
                            )}
                            {onGoHome && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-2 border-gray-300 text-lg font-bold transition-smooth hover:scale-105"
                                    onClick={onGoHome}
                                >
                                    <Home className="h-5 w-5" />
                                    Về trang chủ
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
