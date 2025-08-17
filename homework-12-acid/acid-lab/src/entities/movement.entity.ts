import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Account} from "./account.entity";

@Entity('movements')
@Check(`"amount" > 0`)
@Check(`"from_id" <> "to_id"`)
export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index('idx_movements_from_id')
    @ManyToOne(() => Account, { onDelete: 'RESTRICT', nullable: false })
    @JoinColumn({ name: 'from_id' })
    from!: Account;

    @Index('idx_movements_to_id')
    @ManyToOne(() => Account, { onDelete: 'RESTRICT', nullable: false })
    @JoinColumn({ name: 'to_id' })
    to!: Account;

    @Column('numeric', { precision: 20, scale: 2 })
    amount!: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;
}