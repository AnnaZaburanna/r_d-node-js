import {Check, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'accounts' })
@Check(`"balance" >= 0`)
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
    balance!: number | string;
}