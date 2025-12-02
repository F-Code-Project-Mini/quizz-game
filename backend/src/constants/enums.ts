export const MAX_HISTORY_PASSWORD = 5;
export enum UserVerifyStatus {
    Unverifyed, // giá trị là: 0
    Verified, // 1
    Banned, // 2
}
export enum TokenType {
    // Lưu ý: Không được thay đổi thứ tự enum tránh lỗi token đã được cấp phát ngoài kia
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken,
}
export enum RoleType {
    ADMIN = "ADMIN",
    PLAYER = "PLAYER",
}
export enum RolePlayer {
    LEADER = "LEADER",
    MEMBER = "MEMBER",
}
export enum ExpiresInTokenType {
    AccessToken = 2 * 60 * 60, // 2 giờ
    RefreshToken = 30 * 24 * 60 * 60, // 30 ngày
    ForgotPasswordToken = 15 * 60, // 15 phút
    EmailVerifyToken = 7 * 24 * 60 * 60, // 7 ngày
}
