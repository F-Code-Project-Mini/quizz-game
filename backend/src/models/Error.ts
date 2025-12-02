export type ErrorsType = Record<
    string,
    {
        msg: string;
        [key: string]: any;
    }
>;

export class ErrorWithStatus {
    // mặc định access modifier là: public
    message: string;
    status: number;
    constructor({ message, status }: { message: string; status: number }) {
        this.message = message;
        this.status = status;
    }
}
