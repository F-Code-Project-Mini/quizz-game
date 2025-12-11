import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface AnswerFeedbackProps {
    isCorrect: boolean | null;
    score?: number;
    show: boolean;
}

const AnswerFeedback = ({ isCorrect, score, show }: AnswerFeedbackProps) => {
    if (!show || isCorrect === null) return null;

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-3xl p-12 ${
                    isCorrect
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-red-500 to-red-600"
                } shadow-2xl`}
            >
                <div className="flex flex-col items-center gap-4">
                    {isCorrect ? (
                        <CheckCircle2 className="h-32 w-32 text-white animate-bounce" />
                    ) : (
                        <XCircle className="h-32 w-32 text-white animate-pulse" />
                    )}
                    <p className="text-5xl font-black text-white">{isCorrect ? "Chính xác!" : "Sai rồi!"}</p>
                    {isCorrect && score !== undefined && <p className="text-3xl font-bold text-white">+{score} điểm</p>}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AnswerFeedback;
