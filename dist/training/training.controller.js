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
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const training_service_1 = require("./training.service");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/dto/guard/auth.guard");
let TrainingController = class TrainingController {
    constructor(trainingService, jwtService, userService) {
        this.trainingService = trainingService;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async create(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Authorization header missing'
            });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            const { id } = decodedToken;
            console.log({ id });
            return await this.trainingService.create(id);
        }
        catch (error) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: '토큰이 잘못되거나 만료되었습니다. 혹은 알 수 없는 오류가 생겼습니다'
            });
        }
    }
    async findAll() {
        const health = await this.trainingService.findAll();
        return {
            success: true,
            body: health
        };
    }
    async findAllUserHealth(id) {
        const training = await this.trainingService.findAllUserTraining(id);
        const userId = await this.userService.getOneUser(id);
        if (!userId) {
            throw new common_1.NotFoundException({
                success: false,
                message: `${id}를 가진 유저를 찾지 못했습니다`
            });
        }
        return {
            success: true,
            body: training
        };
    }
    async findOne(id) {
        const training = await this.trainingService.findOne(id);
        if (!training) {
            throw new common_1.NotFoundException({
                success: false,
                message: `${id}를 가진 솔루션 찾지 못했습니다`
            });
        }
        return {
            success: true,
            body: training
        };
    }
    async update(id) {
        const training = await this.trainingService.findOne(id);
        if (!training) {
            throw new common_1.NotFoundException({
                success: false,
                message: `${id}를 가진 솔루션 찾지 못했습니다`
            });
        }
        await this.trainingService.update(id);
        return {
            success: true
        };
    }
    async emove(id) {
        const training = this.trainingService.remove(+id);
        if (!training) {
            throw new common_1.NotFoundException({
                success: false,
                message: `${id}를 가진 솔루션 찾지 못했습니다`
            });
        }
        return {
            success: true
        };
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '운동 관리 솔루션',
        description: '사용자의 정보를 기반으로 맞는 솔루션을 제공 해 줍니다..'
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '그냥 모든 솔루션 가져오기',
        description: '그냥 다 가져옵니다'
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '유져별로 모든 솔루션 가져오기',
        description: '유저별로 다 가져옵니다'
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(':userId/all'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "findAllUserHealth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '솔루션 하나씩 가져오기',
        description: '하나씩 가져옵니다'
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '운동 목표 달성 체크',
        description: 'DB에 fales값을 true로 바꿉니다'
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '솔루션 지우기',
        description: '삭제'
    }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "emove", null);
exports.TrainingController = TrainingController = __decorate([
    (0, swagger_1.ApiTags)('운동 관리 솔루션'),
    (0, common_1.Controller)('training'),
    __metadata("design:paramtypes", [training_service_1.TrainingService,
        jwt_1.JwtService,
        user_service_1.UserService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map