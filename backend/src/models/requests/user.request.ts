import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "import { TokenType } from "../constants/enums";";

export interface TokenPayload extends JwtPayload {
    userId: string;
    type: TokenType;
    exp: number;
    iat: number;
}
