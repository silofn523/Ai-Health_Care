import { Module } from '@nestjs/common'
import { HealthService } from './health.service'
import { HealthController } from './health.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Health } from './entities/health.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Health]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'JWT')
      })
    }),
    UserModule
  ],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule {}
