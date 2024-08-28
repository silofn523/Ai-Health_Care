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
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: '이름', default: '김신우' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  public readonly username: string

  @ApiProperty({ description: '비밀번호', default: '1234' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  public readonly password: string

  @ApiProperty({ description: '전화번호', default: '01012345678' })
  @IsNotEmpty()
  @IsPhoneNumber('KR') // 'KR'은 대한민국의 국가 코드
  @Matches(/^010\d{7,8}$/, {
    message: 'Phone number must start with 010 and contain 10 or 11 digits'
  })
  public readonly tel: string

  @ApiProperty({ description: '성별', default: '남성 혹은 여성' })
  @IsNotEmpty()
  public readonly sex: SexEnum // 성별

  @ApiProperty({ description: '나아', default: '65' })
  @IsNotEmpty()
  @IsNumber()
  public readonly age: number // 나이

  @ApiProperty({ description: '키', default: '170' })
  @IsNotEmpty()
  @IsNumber()
  public readonly height: number // 키

  @ApiProperty({ description: '몸무게', default: '50' })
  @IsNotEmpty()
  @IsNumber()
  public readonly weight: number // 몸무게

  @ApiProperty({ description: '질병', default: '고혈압' })
  @IsString()
  public readonly disease: string // 질병
}
