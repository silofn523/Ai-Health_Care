import { HealthService } from './health.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Health } from './entities/health.entity';
import { UserService } from 'src/user/user.service';
export declare class HealthController {
    private readonly healthService;
    private readonly jwtService;
    private readonly userService;
    constructor(healthService: HealthService, jwtService: JwtService, userService: UserService);
    create(req: Request): Promise<{
        Breakfast: string;
        Lunch: string;
        Dinner: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        body: Health[];
    }>;
    findAllUserHealth(id: number): Promise<{
        success: boolean;
        body: Health[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        body: Health;
    }>;
    emove(id: string): Promise<{
        success: boolean;
    }>;
}
