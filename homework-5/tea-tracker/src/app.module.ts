import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TeaModule} from "./tea/tea.module";
import {APP_GUARD} from "@nestjs/core";
import {ApiKeyGuard} from "./tea/shared/guards/api-key.guard";


@Module({
  imports: [
    TeaModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger,
    { provide: APP_GUARD, useClass: ApiKeyGuard }
  ],
})
export class AppModule {}
