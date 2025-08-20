
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller()
export class LoggerController {
    private readonly logger = new Logger(LoggerController.name);

    @EventPattern('events.notifications')
    async handleNotification(@Payload() payload: any, @Ctx() context: KafkaContext) {
        const event = payload?.value ?? payload;

        this.logger.log(`[Kafka] ${event?.type ?? 'UnknownEvent'} ${JSON.stringify(event?.data ?? {})}`);

        const message = context.getMessage();
        const topic = context.getTopic();
        const partition = context.getPartition();
        const offset = message?.offset;

        this.logger.debug(`topic=${topic} partition=${partition} offset=${offset}`);
    }
}
