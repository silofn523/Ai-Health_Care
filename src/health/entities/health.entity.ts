import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { User } from 'src/user/entities/user.entity'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Health extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @CreateDateColumn({ type: 'timestamp' })
  public readonly date: Date          // 날짜

  @Column()
  @IsNotEmpty()
  @IsString()
  public readonly breakfast: string   // 아침식사

  @Column()
  @IsNotEmpty()
  @IsString()
  public readonly lunch: string       // 점심식사

  @Column()
  @IsNotEmpty()
  @IsString()
  public readonly dinner: string      // 저녁식사

  @Column()
  @IsNumber()
  @IsNotEmpty()
  public userId: number

  @ManyToOne(() => User, (user) => user.health)
  public readonly user: User
}
