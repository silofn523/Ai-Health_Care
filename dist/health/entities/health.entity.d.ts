import { User } from 'src/user/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Health extends BaseEntity {
    readonly id: number;
    readonly date: Date;
    readonly breakfast: string;
    readonly lunch: string;
    readonly dinner: string;
    userId: number;
    readonly user: User;
}
