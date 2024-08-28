import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginUser(dto: LoginDto): Promise<{
        success: boolean;
        accessToken?: string;
        refreshToken?: string;
    }>;
    createTokenAccess(req: Request): Promise<{
        success: boolean;
        message: string;
        token: {
            newAccessToken: string;
        };
    }>;
    checkToken(req: Request): Promise<{
        success: boolean;
        body: {
            userId: {
                id: number;
                type: 'refresh' | 'access';
            };
            token: string;
        };
    }>;
}
