import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "~/models/requests/user.request";
interface SignTokenType {
    payload: string | object | Buffer;
    options?: SignOptions;
}
export default class AlgoJwt {
    static signToken = ({ payload, options = { algorithm: "HS256" } }: SignTokenType): Promise<string> => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECURE as string, options, (error, token) => {
                if (error) throw reject(error);
                return resolve(token as string);
            });
        });
    };

    static verifyToken = ({
        token,
        secretKey = process.env.JWT_SECURE as string,
    }: {
        token: string;
        secretKey?: string;
    }): Promise<TokenPayload> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) throw reject(error);
                return resolve(decoded as TokenPayload);
            });
        });
    };
}
