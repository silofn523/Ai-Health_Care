import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ description: '전화번호', default: '01012345678' })
  @IsNotEmpty()
  @IsString()
  readonly login: string

  @ApiProperty({ description: '비밀번호', default: 'abcd123!' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[a-z A-Z 0-9 !? @]*$/, {
    message: 'password only accepts english and number and !? and @'
  })
  readonly password: string
}
