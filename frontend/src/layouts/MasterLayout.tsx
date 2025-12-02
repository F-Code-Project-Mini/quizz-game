import { Outlet } from "react-router-dom";
import { useIsLandscape } from "~/hooks/useIsLandscape";
import useMusicHook from "~/hooks/useMusicHook";

const MasterLayout = () => {
    const { playMusic } = useMusicHook("/music/quizz.mp3");
    const handleStartMusic = () => {
        playMusic();
    };
    const isLandscape = useIsLandscape();

    if (!isLandscape) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center text-[18px] font-semibold">
                <p>Vui lòng xoay ngang điện thoại để chơi game.</p>
                <p className="mt-2 text-sm font-normal">
                    Nếu bạn đang dùng máy tính, hãy thu nhỏ chiều cao cửa sổ hoặc phóng to theo chiều ngang.
                </p>
            </div>
        );
    }
    return (
        <div onClick={handleStartMusic}>
            <Outlet />
        </div>
    );
};

export default MasterLayout;
