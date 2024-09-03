import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { SexEnum } from './enum/role.enum'
import { AuthGuard } from 'src/auth/guard/auth.guard'

@ApiTags('User("유저CRUD")')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '데이터베이스에 사용자를 추가합니다.'
  })
  @ApiBody({ type: CreateUserDto })
  @Post('/signup')
  public async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<{ success: boolean }> {
    const { tel } = createUserDto

    await this.userService.checkUserTel(tel)
    await this.userService.createUser(createUserDto)

    return {
      success: true
    }
  }

  @ApiOperation({
    summary: '모든 사용자 정보 조회',
    description: '사용자 정보들을 불러옵니다.'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  public async findAllUser(): Promise<{ success: boolean; body: User[] }> {
    const users = await this.userService.findAllUser()

    return {
      success: true,
      body: users
    }
  }

  @ApiOperation({
    summary: '하나의 사용자만 조회',
    description: '사용자 정보를 불러옵니다.'
  })
  @Get(':id')
  public async getOneUser(
    @Param('id') id: number
  ): Promise<{ success: boolean; body: User | void }> {
    const user = await this.userService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: user
    }
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '회원 스테이터스를 수정 합니다.'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id/update')
  public async updateUserStatus(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ): Promise<{ success: boolean }> {
    const user = await this.userService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    await this.userService.updateUserStatus(id, updateUserDto)

    return {
      success: true
    }
  }

  @ApiOperation({
    summary: '사용자 계정삭제',
    description: '사용자 계정을 삭제 합니다.'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  public async deleteUser(@Param('id') id: number): Promise<{ success: boolean }> {
    const user = await this.userService.getOneUser(id)

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    await this.userService.deleteUser(id)

    return {
      success: true
    }
  }
}
