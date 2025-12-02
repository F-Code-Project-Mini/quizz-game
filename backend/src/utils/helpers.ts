import { TokenType } from "~/constants/enums";
import { TokenPayload } from "~/models/requests/user.request";

export default class Helpers {
    static isTypeToken = (payload: TokenPayload, type: TokenType = TokenType.ForgotPasswordToken) => {
        return payload.type === type;
    };
    static converFirstUpper = (val: string): string => {
        return val.charAt(0).toUpperCase() + val.slice(1).toLocaleLowerCase();
    };
    static filterRawInfo = (info: string): string => info.substring(1, info.length - 1);

    static getStartOfDay = (date: Date): Date => {
        date.setHours(0, 0, 0, 0);
        return date;
    };

    // Hàm lấy ngày hôm sau để tạo phạm vi lọc
    static getNextDay = (date: Date): Date => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return this.getStartOfDay(nextDay);
    };
}
