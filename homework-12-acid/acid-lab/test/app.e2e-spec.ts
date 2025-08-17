import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Account } from '../src/entities/account.entity';
import { Movement } from '../src/entities/movement.entity';


function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

describe('Transfer e2e', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    ds = app.get(DataSource);
    await ds.synchronize(true);
  });

  beforeEach(async () => {
    await ds.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /transfer — success 201', async () => {
    const ar = ds.getRepository(Account);
    const a1 = await ar.save(ar.create({ balance: '100.00' }));
    const a2 = await ar.save(ar.create({ balance: '0.00' }));

    const res = await request(app.getHttpServer())
        .post('/transfer')
        .send({ fromId: a1.id, toId: a2.id, amount: '50.00' })
        .expect(201);

    expect(res.body).toEqual(
        expect.objectContaining({ fromId: a1.id, toId: a2.id, amount: '50.00' })
    );

    const after1 = await ar.findOneByOrFail({ id: a1.id });
    const after2 = await ar.findOneByOrFail({ id: a2.id });
    expect(after1.balance).toBe('50.00');
    expect(after2.balance).toBe('50.00');

    const mr = ds.getRepository(Movement);
    const moves = await mr.find();
    expect(moves).toHaveLength(1);
  });

  it('POST /transfer — insufficient funds => 400 & atomic', async () => {
    const ar = ds.getRepository(Account);
    const a1 = await ar.save(ar.create({ balance: '10.00' }));
    const a2 = await ar.save(ar.create({ balance: '0.00' }));

    const before1 = await ar.findOneByOrFail({ id: a1.id });
    const before2 = await ar.findOneByOrFail({ id: a2.id });

    await request(app.getHttpServer())
        .post('/transfer')
        .send({ fromId: a1.id, toId: a2.id, amount: '50.00' })
        .expect(400);

    const after1 = await ar.findOneByOrFail({ id: a1.id });
    const after2 = await ar.findOneByOrFail({ id: a2.id });
    expect(after1.balance).toBe(before1.balance);
    expect(after2.balance).toBe(before2.balance);

    const mr = ds.getRepository(Movement);
    expect(await mr.count()).toBe(0);
  });

  it('POST /transfer — FK violation => 400, обидві таблиці порожні', async () => {
    const fakeFrom = uuid();
    const fakeTo = uuid();

    await request(app.getHttpServer())
        .post('/transfer')
        .send({ fromId: fakeFrom, toId: fakeTo, amount: '10.00' })
        .expect(400);

    const ar = ds.getRepository(Account);
    const mr = ds.getRepository(Movement);
    expect(await ar.count()).toBe(0);
    expect(await mr.count()).toBe(0);
  });
});