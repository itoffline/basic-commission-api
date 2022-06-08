import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import * as Joi from 'joi';

import { StoreModule } from './store/store.module';
import { TransactionModule } from './transaction.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    StoreModule,
    TransactionModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AppModule {}
