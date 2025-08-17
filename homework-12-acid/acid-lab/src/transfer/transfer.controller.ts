import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {TransferService} from "./transfer.service";
import {CreateTransferDto} from "./dto/transfer.dto";

@Controller('transfer')
export class TransferController {
    constructor(private readonly service: TransferService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTransferDto) {
        return this.service.transfer(String(dto.fromId), String(dto.toId), String(dto.amount));
    }
}