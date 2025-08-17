import {IsNumberString, IsUUID} from "class-validator";

export class CreateTransferDto {
    @IsUUID() fromId!: string;
    @IsUUID() toId!: string;
    @IsNumberString() amount!: string;
}