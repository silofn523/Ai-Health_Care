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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(jwt, userService) {
        this.jwt = jwt;
        this.userService = userService;
    }
    async signToken(userId, refreshToken) {
        const payload = {
            id: userId,
            type: refreshToken ? 'refresh' : 'access'
        };
        return this.jwt.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: refreshToken ? '30d' : '10m'
        });
    }
    async loginUser(userId) {
        return {
            success: true,
            accessToken: await this.signToken(userId, false),
            refreshToken: await this.signToken(userId, true)
        };
    }
    async loginWithTel(user) {
        const existingUser = await this.checkUser(user);
        return this.loginUser(existingUser);
    }
    async checkUser(dto) {
        const user = await this.userService.findUserByLogin(dto.login, true);
        if (!user) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: 'User or Password Invalid'
            });
        }
        const isPasswordValidated = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValidated) {
            throw new common_1.UnauthorizedException({
                success: false,
                message: `Invalid password`
            });
        }
        console.log(user.id);
        return user.id;
    }
    async verifyToken(token) {
        try {
            const decoded = this.jwt.verify(token);
            return decoded;
        }
        catch (e) {
            if (e instanceof jwt_1.TokenExpiredError) {
                throw new common_1.NotAcceptableException({
                    success: false,
                    message: `만료된 토큰입니다`
                });
            }
            if (e instanceof jwt_1.JsonWebTokenError) {
                throw new common_1.NotAcceptableException({
                    success: false,
                    message: `잘못된 토큰입니다`
                });
            }
            throw new common_1.InternalServerErrorException('JWT_SERVICE_ERROR');
        }
    }
    async rotateToken(token, refreshToken) {
        const decoded = await this.jwt.verify(token, {
            secret: process.env.JWT_SECRET
        });
        if (decoded.type !== 'refresh') {
            throw new common_1.NotAcceptableException({
                success: false,
                message: `토큰 재 발급은 Refresh 토큰으로만 가능합니다`
            });
        }
        const newAccessToken = await this.signToken(decoded.id, refreshToken);
        return {
            success: true,
            message: `토큰 재 발급에 성공했습니다`,
            token: { newAccessToken }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map