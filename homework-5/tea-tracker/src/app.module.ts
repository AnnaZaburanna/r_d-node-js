import {Logger, Module} from '@nestjs/common';
import {TeaModule} from "./tea/tea.module";
import {APP_GUARD} from "@nestjs/core";
import {ApiKeyGuard} from "./tea/shared/guards/api-key.guard";


@Module({
  imports: [
    TeaModule,
  ],
  providers: [ Logger,
    { provide: APP_GUARD, useClass: ApiKeyGuard }
  ],
})
export class AppModule {}
