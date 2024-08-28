import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator'
import { SexEnum } from '../enum/role.enum'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  public readonly password: string

  @IsNotEmpty()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @IsNotEmpty()
  public readonly sex: SexEnum // 성별

  @IsNotEmpty()
  @IsNumber()
  public readonly age: number // 나이

  @IsNotEmpty()
  @IsNumber()
  public readonly height: number // 키

  @IsNotEmpty()
  @IsNumber()
  public readonly weight: number // 몸무게

  @IsString()
  public readonly disease: string // 질병
}
