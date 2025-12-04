export const MAX_HISTORY_PASSWORD = 5;
export enum UserVerifyStatus {
    Unverifyed,
    Verified,
    Banned,
}
export enum TokenType {
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken,
}
export enum IQuestionType {
    SINGLE_CHOICE = "SINGLE_CHOICE",
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    TRUE_FALSE = "TRUE_FALSE",
}
export enum IRoomStatus {
    WAITING = "WAITING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
}
export enum ExpiresInTokenType {
    AccessToken = 2 * 60 * 60, // 2 giờ
    RefreshToken = 30 * 24 * 60 * 60, // 30 ngày
    ForgotPasswordToken = 15 * 60, // 15 phút
    EmailVerifyToken = 7 * 24 * 60 * 60, // 7 ngày
}
