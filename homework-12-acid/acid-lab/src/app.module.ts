import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSourceOptions} from "typeorm";
import {TransferModule} from "./transfer/transfer.module";
import {Account} from "./entities/account.entity";
import {Movement} from "./entities/movement.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useFactory: (): DataSourceOptions => {
        const url = process.env.DATABASE_URL!;
        return {
          type: 'postgres',
          url,
          entities: [Account, Movement],
          synchronize: process.env.TYPEORM_SYNC === 'true',
          logging: false,
        };
      }
    }), TransferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
