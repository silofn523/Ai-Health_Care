import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  NotFoundException,
  UseGuards
} from '@nestjs/common'
import { HealthService } from './health.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Health } from './entities/health.entity'
import { UserService } from 'src/user/user.service'
import { AuthGuard } from 'src/auth/guard/auth.guard'

@ApiTags('식단 관리 솔루션')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({
    summary: '식단 관리 솔루션',
    description: '사용자의 정보를 기반으로 맞는 솔루션을 제공 해 줍니다..'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  public async create(@Req() req: Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authorization header missing'
      })
    }
    const token = authHeader.split(' ')[1]

    try {
      const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })
      const { id } = decodedToken

      console.log({ id })
      return await this.healthService.create(id)
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        message: '토큰이 잘못되거나 만료되었습니다. 혹은 알 수 없는 오류가 생겼습니다'
      })
    }
  }

  @ApiOperation({
    summary: '그냥 모든 솔루션 가져오기',
    description: '그냥 다 가져옵니다'
  })
  @Get()
  public async findAll(): Promise<{ success: boolean; body: Health[] }> {
    const health = await this.healthService.findAll()

    return {
      success: true,
      body: health
    }
  }

  @ApiOperation({
    summary: '유져별로 모든 솔루션 가져오기',
    description: '유저별로 다 가져옵니다'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':userId/all')
  public async findAllUserHealth(
    @Param('userId') id: number
  ): Promise<{ success: boolean; body: Health[] }> {
    const health = await this.healthService.findAllUserHealth(id)
    const userId = await this.userService.getOneUser(id)

    if (!userId) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: health
    }
  }

  @ApiOperation({
    summary: '솔루션 하나씩 가져오기',
    description: '하나씩 가져옵니다'
  })
  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<{ success: boolean; body: Health }> {
    const health = await this.healthService.findOne(id)

    if (!health) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 솔루션 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: health
    }
  }

  @ApiOperation({
    summary: '솔루션 지우기',
    description: '삭제'
  })
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const health = this.healthService.remove(+id)

    if (!health) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 솔루션 찾지 못했습니다`
      })
    }

    return {
      success: true
    }
  }
}
