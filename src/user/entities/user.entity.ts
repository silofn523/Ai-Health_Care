import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SexEnum } from '../enum/role.enum'
import { Health } from 'src/health/entities/health.entity'
import { Training } from 'src/training/entities/training.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly username: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  public readonly password: string

  @Column({ unique: true })
  @IsNotEmpty()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @Column()
  @IsNotEmpty()
  public readonly sex: SexEnum // 성별

  @Column()
  @IsNotEmpty()
  @IsNumber()
  public readonly age: number // 나이

  @Column()
  @IsNotEmpty()
  @IsNumber()
  public readonly height: number // 키

  @Column()
  @IsNotEmpty()
  @IsNumber()
  public readonly weight: number // 몸무게

  @Column()
  @IsString()
  public readonly disease: string // 질병

  @OneToMany(() => Health, (health) => health.user)
  public readonly health: Health[]

  @OneToMany(() => Training, (training) => training.user)
  public readonly training: Training[]
}
