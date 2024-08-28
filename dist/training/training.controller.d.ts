import { TrainingService } from './training.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { Training } from './entities/training.entity';
export declare class TrainingController {
    private readonly trainingService;
    private readonly jwtService;
    private readonly userService;
    constructor(trainingService: TrainingService, jwtService: JwtService, userService: UserService);
    create(req: Request): Promise<{
        Work: string;
        Target: string;
        Location: string;
        Effect: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        body: Training[];
    }>;
    findAllUserHealth(id: number): Promise<{
        success: boolean;
        body: Training[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        body: Training;
    }>;
    update(id: number): Promise<{
        success: boolean;
    }>;
    emove(id: string): Promise<{
        success: boolean;
    }>;
}
