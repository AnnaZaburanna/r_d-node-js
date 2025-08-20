import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {NOTIFICATIONS_KAFKA} from "./kafka.constants";


@Module({
    imports: [
        ClientsModule.register([
            {
                name: NOTIFICATIONS_KAFKA,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'notification-producer',
                        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
                    },
                    producerOnlyMode: true,
                },
            },
        ]),
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
