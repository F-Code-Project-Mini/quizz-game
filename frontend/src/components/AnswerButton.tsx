import { Check, X } from "lucide-react";

interface AnswerButtonProps {
    answer: string;
    color: "red" | "blue" | "yellow" | "green";
    icon?: React.ReactNode;
    onClick?: () => void;
    isSelected?: boolean;
    isCorrect?: boolean;
    showResult?: boolean;
    disabled?: boolean;
}

const colorClasses = {
    red: "answer-red hover:shadow-glow",
    blue: "answer-blue hover:shadow-glow",
    yellow: "answer-yellow hover:shadow-glow",
    green: "answer-green hover:shadow-glow",
};

const iconBgColors = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    yellow: "bg-yellow-600",
    green: "bg-green-600",
};

const AnswerButton = ({
    answer,
    color,
    icon,
    onClick,
    isSelected = false,
    isCorrect = false,
    showResult = false,
    disabled = false,
}: AnswerButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                group relative flex min-h-[80px] sm:min-h-[100px] md:min-h-[120px] w-full items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6
                text-left text-white shadow-xl transition-all duration-300
                ${colorClasses[color]}
                ${isSelected ? "scale-105 ring-2 sm:ring-4 ring-white" : ""}
                ${disabled ? "cursor-not-allowed opacity-60" : "hover:scale-105"}
                ${showResult && isCorrect ? "ring-2 sm:ring-4 ring-green-400" : ""}
                ${showResult && !isCorrect && isSelected ? "ring-2 sm:ring-4 ring-red-400" : ""}
            `}
        >
            {/* Icon */}
            <div
                className={`flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl ${iconBgColors[color]} shadow-lg`}
            >
                {icon || <span className="text-2xl sm:text-2xl md:text-3xl font-black">{answer.charAt(0)}</span>}
            </div>

            {/* Answer Text */}
            <div className="flex-1 pr-8 sm:pr-10">
                <p className="text-base sm:text-lg md:text-xl font-bold leading-tight">{answer}</p>
            </div>

            {/* Result Indicator */}
            {showResult && (
                <div className="absolute right-3 sm:right-4 top-3 sm:top-4">
                    {isCorrect ? (
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                            <Check className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                    ) : isSelected ? (
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-500 shadow-lg">
                            <X className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                    ) : null}
                </div>
            )}

            {/* Hover Effect */}
            {!disabled && !showResult && (
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/0 transition-all group-hover:bg-white/10"></div>
            )}
        </button>
    );
};

export default AnswerButton;
