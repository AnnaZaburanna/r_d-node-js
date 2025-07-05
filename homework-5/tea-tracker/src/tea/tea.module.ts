import { Module } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';
import { ThrottlerModule} from "@nestjs/throttler";

@Module({
  imports: [
      ThrottlerModule.forRoot([{ ttl: 60000, limit: 10,}])
  ],
  controllers: [TeaController],
  providers: [TeaService]
})
export class TeaModule {}
