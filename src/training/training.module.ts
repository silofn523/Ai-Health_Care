import { Module } from '@nestjs/common'
import { TrainingService } from './training.service'
import { TrainingController } from './training.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Training } from './entities/training.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Training]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'JWT')
      })
    }),
    UserModule
  ],
  controllers: [TrainingController],
  providers: [TrainingService]
})
export class TrainingModule {}
