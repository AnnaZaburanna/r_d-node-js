import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Movement} from "../entities/movement.entity";
import {Account} from "../entities/account.entity";
import {TransferService} from "./transfer.service";
import {TransferController} from "./transfer.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Account, Movement])],
    controllers: [TransferController],
    providers: [TransferService],
})
export class TransferModule {}