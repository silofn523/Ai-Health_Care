import { ConflictException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { SexEnum } from './enum/role.enum'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  public async createUser(dto: CreateUserDto): Promise<void> {
    const salt = await bcrypt.genSalt()
    const password = await this.hashPassword(dto.password, salt)
    await this.checkSex(dto.sex)

    await this.user.insert({
      username: dto.username,
      password,
      tel: dto.tel,
      sex: dto.sex,
      height: dto.height,
      weight: dto.weight,
      age: dto.age,
      disease: dto.disease
    })
  }

  public async checkSex(sex: string): Promise<string> {
    if(!Object.values(SexEnum).includes(sex as SexEnum)) {
      throw new ConflictException({
        success: false,
        message: `성별은 남성 혹은 여성만 가능합니다`
      })
    }

    return sex
  }
  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public async checkUserTel(tel: string): Promise<void> {
    const existing = await this.user.findOne({
      where: {
        tel
      }
    })

    if (existing) {
      throw new ConflictException({
        success: false,
        message: `${tel}은 이미 사용중인 전화번호 입니다`
      })
    }
  }

  public async findAllUser(): Promise<User[]> {
    return await this.user.find()
  }

  public async getOneUser(id: number): Promise<User> {
    return await this.user.findOne({
      where: {
        id
      }
    })
  }

  public async updateUserStatus(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { ...update } = updateUserDto

    if (update.password) {
      const salt = await bcrypt.genSalt()

      update.password = await this.hashPassword(update.password, salt)
    }
    if (update.tel) {
      await this.checkUserTel(updateUserDto.tel)
    }
    if (update.sex) {
      await this.checkSex(updateUserDto.sex)
    }
    await this.user.update({ id }, update)
  }

  public async deleteUser(id: number): Promise<void> {
    await this.user.delete({ id })
  }

  public async findUserByLogin(login: string, secret = false): Promise<User> {
    return await this.user.findOne({
      where: [ 
        { tel: login }
       ],
       select: {
        id: true,
        username: true,
        password: secret,
        tel: true,
        sex: true,
        height: true,
        weight: true,
        age: true,
        disease: true
       }
    })
  }
}
