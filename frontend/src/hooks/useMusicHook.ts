// useMusicHook.ts (Tùy chỉnh để cung cấp hàm play)
import { useEffect, useRef } from "react";

const useMusicHook = (fileName: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (fileName) {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(fileName);
            audio.loop = true;
            audioRef.current = audio;

            return () => {
                audio.pause();
            };
        }
    }, [fileName]);

    // Trả về hàm play để kích hoạt bằng người dùng
    const playMusic = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(console.error);
        }
    };

    return { playMusic };
};

export default useMusicHook;
