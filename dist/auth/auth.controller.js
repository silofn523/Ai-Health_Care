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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const Login_dto_1 = require("./dto/Login.dto");
const auth_guard_1 = require("./dto/guard/auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async loginUser(dto) {
        return await this.authService.loginWithTel(dto);
    }
    async createTokenAccess(req) {
        const authHeader = await req.headers['authorization'];
        if (!authHeader) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Authorization header missing'
            });
        }
        const token = await authHeader.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Token missing'
            });
        }
        await this.authService.verifyToken(token);
        return await this.authService.rotateToken(token, false);
    }
    async checkToken(req) {
        const authHeader = await req.headers['authorization'];
        if (!authHeader) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Authorization header missing'
            });
        }
        const token = await authHeader.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'Token missing'
            });
        }
        const userId = await this.authService.verifyToken(token);
        return {
            success: true,
            body: {
                userId: {
                    id: userId.id,
                    type: userId.type
                },
                token
            }
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '로그인'
    }),
    (0, swagger_1.ApiBody)({ type: Login_dto_1.LoginDto }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '토큰 재 발급',
        description: 'access토큰을 재 발급 합니다.'
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('token/access'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createTokenAccess", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '유저 확인',
        description: '로그인한(토큰의 주인) 유저가 누군지 확인.'
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('check_token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth("로그인 & 인증관리")'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map