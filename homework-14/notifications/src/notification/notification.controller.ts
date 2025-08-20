import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

class SignupDto {
    email!: string;
}

@Controller()
export class NotificationController {
    constructor(private readonly notifications: NotificationService) {}

    @Post('signup')
    @HttpCode(202)
    async signup(@Body() dto: SignupDto) {
        const event = await this.notifications.publishUserSignedUp(dto.email);
        return { status: 'accepted', published: event };
    }
}
