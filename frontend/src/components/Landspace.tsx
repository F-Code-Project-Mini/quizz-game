import { useIsLandscape } from "../hooks/useIsLandscape";

export function QuizGamePage() {
    const isLandscape = useIsLandscape();

    if (!isLandscape) {
        // Màn hình yêu cầu xoay ngang
        return (
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: 600,
                }}
            >
                <p>Vui lòng xoay ngang điện thoại để chơi game.</p>
                <p style={{ marginTop: 8, fontSize: 14, fontWeight: 400 }}>
                    Nếu bạn đang dùng máy tính, hãy thu nhỏ chiều cao cửa sổ hoặc phóng to theo chiều ngang.
                </p>
            </div>
        );
    }

    // UI quizz game bình thường
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Đặt game layout của bạn ở đây */}
            <div>Quizz Game ở đây nè</div>
        </div>
    );
}
