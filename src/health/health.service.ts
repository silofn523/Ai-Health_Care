import { NotFoundException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { Health } from './entities/health.entity'
import OpenAI from 'openai'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export class HealthService {
  private readonly ai: OpenAI

  constructor(
    @InjectRepository(Health)
    private readonly health: Repository<Health>,
    private readonly userService: UserService
  ) {
    this.ai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY
      // endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      // apiVersion: process.env.AZURE_OPENAI_API_VERSION,
      // baseURL: process.env.AZURE_OPENAI_BASEURL
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

      const breakfast = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `키${user.height}에 성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}있는 사람에게 좋은 아침 메뉴를 의성 특성물을 위주로짜주고 양도 조절해줘 단위는 공깃밥 몇 그릇 이런식으로 해 주고 칼로리도 보여줘 딴 말 하지말고 급식표 느낌으로 첫 말은 오늘의 아침메뉴 입니다로`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Breakfast = breakfast.choices[0].message.content

      const lunch = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `키${user.height}에 성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}있는 사람에게 좋은 점심 메뉴를 의성 특성물을 위주로짜주고 양도 조절해줘 단위는 공깃밥 몇 그릇 이런식으로 해 주고 칼로리도 보여줘 딴 말 하지말고 급식표 느낌으로 첫 말은 오늘의 점심메뉴 입니다로`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Lunch  = lunch.choices[0].message.content

      const dinner = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `키${user.height}에 성별${user.sex}, 나이는 ${user.age}살이고 몸무게 ${user.weight}에 질병은 ${user.disease}있는 사람에게 좋은 저녁 메뉴를 의성 특성물을 위주로짜주고 양도 조절해줘 단위는 공깃밥 몇 그릇 이런식으로 해 주고 칼로리도 보여줘 딴 말 하지말고 급식표 느낌으로 첫 말은 오늘의 저녁메뉴 입니다로`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
      const Dinner = dinner.choices[0].message.content

      await this.health.insert({
        breakfast: Breakfast,
        lunch: Lunch ,
        dinner: Dinner,
        userId: user.id
      })

      return {
        Breakfast,
        Lunch ,
        Dinner
      }
    } catch (error) {
      console.error('완성 생성 중 오류 발생:', error.message)
      console.error(error)
      throw error
    }
  }

  public async findAllUserHealth(userId: number): Promise<Health[]> {
    return this.health.find({
      where: {
        userId
      },
      order: {
        date: 'DESC' // 오름차순 정렬
      }
    })
  }

  public async findOne(id: number): Promise<Health> {
    return await this.health.findOne({
      where: {
        id
      }
    })
  }

  public async findAll(): Promise<Health[]> {
    return await this.health.find()
  }

  public async remove(id: number): Promise<void> {
    await this.health.delete(id)
  }
}
