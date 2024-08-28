import { Training } from './entities/training.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
export declare class TrainingService {
    private readonly training;
    private readonly userService;
    private readonly ai;
    constructor(training: Repository<Training>, userService: UserService);
    create(id: number): Promise<{
        Work: string;
        Target: string;
        Location: string;
        Effect: string;
    }>;
    findAll(): Promise<Training[]>;
    findOne(id: number): Promise<Training>;
    findAllUserTraining(userId: number): Promise<Training[]>;
    update(id: number): Promise<void>;
    remove(id: number): Promise<void>;
}
