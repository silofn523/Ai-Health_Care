"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const health_entity_1 = require("./entities/health.entity");
const openai_1 = require("openai");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let HealthService = class HealthService {
    constructor(health, userService) {
        this.health = health;
        this.userService = userService;
        this.ai = new openai_1.default({
            apiKey: process.env.AZURE_OPENAI_API_KEY
        });
    }
    async create(id) {
        try {
            const user = await this.userService.getOneUser(id);
            if (!user) {
                throw new common_1.NotFoundException({
                    success: false,
                    message: `${id}를 가진 유저를 찾지 못했습니다`
                });
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
            });
            const Breakfast = breakfast.choices[0].message.content;
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
            });
            const Lunch = lunch.choices[0].message.content;
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
            });
            const Dinner = dinner.choices[0].message.content;
            await this.health.insert({
                breakfast: Breakfast,
                lunch: Lunch,
                dinner: Dinner,
                userId: user.id
            });
            return {
                Breakfast,
                Lunch,
                Dinner
            };
        }
        catch (error) {
            console.error('완성 생성 중 오류 발생:', error.message);
            console.error(error);
            throw error;
        }
    }
    async findAllUserHealth(userId) {
        return this.health.find({
            where: {
                userId
            },
            order: {
                date: 'DESC'
            }
        });
    }
    async findOne(id) {
        return await this.health.findOne({
            where: {
                id
            }
        });
    }
    async findAll() {
        return await this.health.find();
    }
    async remove(id) {
        await this.health.delete(id);
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(health_entity_1.Health)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], HealthService);
//# sourceMappingURL=health.service.js.map