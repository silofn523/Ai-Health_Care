import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  Req,
  ValidationPipe,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/Login.dto'
import { Request } from 'express'
import { AuthGuard } from './guard/auth.guard'

@ApiTags('Auth("로그인 & 인증관리")')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인'
  })
  @ApiBody({ type: LoginDto })
  @Post('login')
  public async loginUser(@Body(ValidationPipe) dto: LoginDto): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    return await this.authService.loginWithTel(dto)
  }

  @ApiOperation({
    summary: '토큰 재 발급',
    description: 'access토큰을 재 발급 합니다.'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('token/access')
  public async createTokenAccess(@Req() req: Request): Promise<{
    success: boolean
    message: string
    token: { newAccessToken: string }
  }> {
    const authHeader = await req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }
    const token = await authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token missing'
      })
    }
    await this.authService.verifyToken(token)

    return await this.authService.rotateToken(token, false) // falses는 access토큰 발급
  }

  @ApiOperation({
    summary: '유저 확인',
    description: '로그인한(토큰의 주인) 유저가 누군지 확인.'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('check_token')
  public async checkToken(
    @Req() req: Request
  ): Promise<{
    success: boolean;
    body: { userId: { id: number; type: 'refresh' | 'access' }; token: string };
  }> {
    const authHeader = await req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }

    const token = await authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token missing'
      })
    }
    const userId = await this.authService.verifyToken(token)

    return {
      success: true,
      body: {
        userId: {
          id: userId.id,
          type: userId.type
        },
        token
      }
    }
  }
}
