import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import {NOTIFICATIONS_KAFKA, NOTIFICATIONS_TOPIC} from "./kafka.constants";

export interface UserSignedUpEvent {
    type: 'UserSignedUp';
    data: {
        userId: string;
        email: string;
        timestamp: string; // ISO
    };
}

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
    constructor(@Inject(NOTIFICATIONS_KAFKA) private readonly kafka: ClientKafka) {}

    async onModuleInit() {
        await this.kafka.connect();
    }

    async onModuleDestroy() {
        await this.kafka.close();
    }

    async publishUserSignedUp(email: string) {
        const event: UserSignedUpEvent = {
            type: 'UserSignedUp',
            data: {
                userId: randomUUID(),
                email,
                timestamp: new Date().toISOString(),
            },
        };

        this.kafka.emit(NOTIFICATIONS_TOPIC, event);
        return event;
    }
}
