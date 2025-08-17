import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Movement } from '../entities/movement.entity';

@Injectable()
export class TransferService {
    constructor(@InjectDataSource() private readonly ds: DataSource) {}
    async transfer(fromId: string, toId: string, amountIn: string | number) {
        const amount = String(amountIn);

        if (fromId === toId) {
            throw new BadRequestException('fromId must differ from toId');
        }

        const qr = this.ds.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            const from = await qr.manager
                .getRepository(Account)
                .createQueryBuilder('a')
                .where('a.id = :id', { id: fromId })
                .setLock('pessimistic_write')
                .getOne();

            const to = await qr.manager
                .getRepository(Account)
                .createQueryBuilder('a')
                .where('a.id = :id', { id: toId })
                .setLock('pessimistic_write')
                .getOne();

            if (!from || !to) {
                throw new BadRequestException('Account not found');
            }

            await qr.query(
                'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
                [amount, fromId],
            );

            await qr.query(
                'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
                [amount, toId],
            );

            const insert = await qr.manager
                .getRepository(Movement)
                .createQueryBuilder()
                .insert()
                .values({ amount: String(amount), from: { id: fromId } as any, to: { id: toId } as any })
                .returning(['id', 'created_at'])
                .execute();

            const row = insert.raw?.[0];
            await qr.commitTransaction();

            return {
                id: row?.id,
                fromId,
                toId,
                amount: String(amount),
                created_at: row?.created_at,
            };
        } catch (e: any) {
            try { await qr.rollbackTransaction(); } catch {}

            if (e?.code === '23514') {
                throw new BadRequestException('Insufficient funds or amount invalid');
            }
            if (e?.code === '23503') {
                throw new BadRequestException('Account FK violation');
            }
            if (e instanceof BadRequestException) throw e;
            throw e;
        } finally {
            await qr.release();
        }
    }
}