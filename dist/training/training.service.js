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
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const typeorm_1 = require("@nestjs/typeorm");
const training_entity_1 = require("./entities/training.entity");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
let TrainingService = class TrainingService {
    constructor(training, userService) {
        this.training = training;
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
            });
            const Work = work.choices[0].message.content;
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
            });
            const Target = target.choices[0].message.content;
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
            });
            const Location = location.choices[0].message.content;
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
            });
            const Effect = effect.choices[0].message.content;
            await this.training.insert({
                work: Work,
                target: Target,
                location: Location,
                effect: Effect,
                userId: user.id
            });
            return {
                Work,
                Target,
                Location,
                Effect
            };
        }
        catch (error) {
            console.error('완성 생성 중 오류 발생:', error.message);
            console.error(error);
            throw error;
        }
    }
    async findAll() {
        return await this.training.find();
    }
    async findOne(id) {
        return await this.training.findOne({
            where: {
                id
            }
        });
    }
    async findAllUserTraining(userId) {
        return this.training.find({
            where: {
                userId
            },
            order: {
                date: 'DESC'
            }
        });
    }
    async update(id) {
        const training = await this.findOne(id);
        if (training.check == true) {
            throw new common_1.ConflictException({
                success: false,
                message: `이미 완료한 운동입니다.`
            });
        }
        await this.training.update({ id }, { check: true });
    }
    async remove(id) {
        await this.training.delete(id);
    }
};
exports.TrainingService = TrainingService;
exports.TrainingService = TrainingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(training_entity_1.Training)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], TrainingService);
//# sourceMappingURL=training.service.js.map