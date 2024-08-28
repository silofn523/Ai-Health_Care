import { SexEnum } from '../enum/role.enum';
export declare class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly tel: string;
    readonly sex: SexEnum;
    readonly age: number;
    readonly height: number;
    readonly weight: number;
    readonly disease: string;
}
