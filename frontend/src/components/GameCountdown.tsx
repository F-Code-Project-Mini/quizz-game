import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameCountdownProps {
    onComplete: () => void;
}

const GameCountdown = ({ onComplete }: GameCountdownProps) => {
    const [count, setCount] = useState(5);

    useEffect(() => {
        setCount(5);

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    if (count === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900"
            >
                <div className="relative">
                    <motion.div
                        key={count}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-20"></div>
                        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-2xl ring-8 ring-white/50">
                            <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600">
                                {count}
                            </span>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center text-3xl font-bold text-white"
                    >
                        {count === 5 && "Chuẩn bị..."}
                        {count === 4 && "Sẵn sàng..."}
                        {count === 3 && "Bắt đầu..."}
                        {count === 2 && "Chú ý!"}
                        {count === 1 && "Go!"}
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameCountdown;
