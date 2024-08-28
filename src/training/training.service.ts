import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import OpenAI from 'openai'
import { InjectRepository } from '@nestjs/typeorm'
import { Training } from './entities/training.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'

@Injectable()
export class TrainingService {
  private readonly ai: OpenAI

  constructor(
    @InjectRepository(Training)
    private readonly training: Repository<Training>,
    private readonly userService: UserService
  ) {
    this.ai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY
    })
  }

  public async create(id: number) {
    try {
      const user = await this.userService.getOneUser(id)

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: `${id}를 가진 유저를 찾지 못했습니다`
        })
      }

      const work = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}인 사람에게 좋은 운동 종류를 추천 해 줘 할 말만 하고 설명은 필요없고 추천만 해 간단히 추천하는 이유도 두 줄 정도로만`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Work = work.choices[0].message.content

      const target = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}인 사람에게 ${Work} 이렇게 추천한 운동 목표도 두 줄만 첫 문장은 이 운동의 목표는 으로 시작해 `
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Target = target.choices[0].message.content

      const location = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `${Work}라고 니가 추천한 운동을 할 수 있는 장소를 의성에서 추천 해 줘 간단히 몇 군데만 추천해`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Location = location.choices[0].message.content

      const effect = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `${Work}라고 니가 추천한 운동이 성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}인 사람이게 어떤 효과가 있는지 간략히 세 줄만 적어 이 운동의 효능은 으로 첫 문장을 시작해`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Effect = effect.choices[0].message.content

      await this.training.insert({
        work: Work,
        target: Target,
        location: Location,
        effect: Effect,
        userId: user.id
      })

      return {
        Work,
        Target,
        Location,
        Effect
      }
    } catch (error) {
      console.error('완성 생성 중 오류 발생:', error.message)
      console.error(error)
      throw error
    }
  }

  public async findAll(): Promise<Training[]> {
    return await this.training.find()
  }

  public async findOne(id: number): Promise<Training> {
    return await this.training.findOne({
      where: {
        id
      }
    })
  }

  public async findAllUserTraining(userId: number): Promise<Training[]> {
    return this.training.find({
      where: {
        userId
      },
      order: {
        date: 'DESC' // 오름차순 정렬
      }
    })
  }

  public async update(id: number) {
    const training = await this.findOne(id)

    if (training.check == true) {
      throw new ConflictException({
        success: false,
        message: `이미 완료한 운동입니다.`
      })
    }

    await this.training.update({ id }, { check: true })
  }

  public async remove(id: number): Promise<void> {
    await this.training.delete(id)
  }
}
