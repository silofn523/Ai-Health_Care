import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { User } from 'src/user/entities/user.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Training extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @CreateDateColumn({ type: 'timestamp' })
  public readonly date: Date

  @Column({ default: false })
  @IsBoolean()
  @IsNotEmpty()
  public readonly check: boolean // 운동 완료체크

  @Column()
  @IsString()
  @IsNotEmpty()
  public readonly work: string // 운동 종류

  @Column()
  @IsString()
  @IsNotEmpty()
  public readonly target: string // 운동 목표

  @Column()
  @IsString()
  @IsNotEmpty()
  public readonly location: string // 운동 장소

  @Column()
  @IsString()
  @IsNotEmpty()
  public readonly effect: string // 운동 효과

  @Column()
  @IsNumber()
  @IsNotEmpty()
  public userId: number

  @ManyToOne(() => User, (user) => user.training)
  public readonly user: User
}
