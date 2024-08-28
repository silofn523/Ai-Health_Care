import { UserService } from 'src/user/user.service';
import { Health } from './entities/health.entity';
import { Repository } from 'typeorm';
export declare class HealthService {
    private readonly health;
    private readonly userService;
    private readonly ai;
    constructor(health: Repository<Health>, userService: UserService);
    create(id: number): Promise<{
        Breakfast: string;
        Lunch: string;
        Dinner: string;
    }>;
    findAllUserHealth(userId: number): Promise<Health[]>;
    findOne(id: number): Promise<Health>;
    findAll(): Promise<Health[]>;
    remove(id: number): Promise<void>;
}
