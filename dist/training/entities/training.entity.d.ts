import { User } from 'src/user/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Training extends BaseEntity {
    readonly id: number;
    readonly date: Date;
    readonly check: boolean;
    readonly work: string;
    readonly target: string;
    readonly location: string;
    readonly effect: string;
    userId: number;
    readonly user: User;
}
