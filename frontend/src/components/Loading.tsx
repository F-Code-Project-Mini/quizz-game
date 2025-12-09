import { Loader2 } from "lucide-react";

interface LoadingProps {
    text?: string;
    size?: "sm" | "md" | "lg";
}

const Loading = ({ text = "Đang tải...", size = "md" }: LoadingProps) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/50"></div>

                {/* Spinning loader */}
                <Loader2
                    className={`${sizeClasses[size]} animate-spin text-purple-600`}
                />
            </div>

            {text && (
                <p className={`${textSizeClasses[size]} font-bold text-gray-700 animate-pulse`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loading;
