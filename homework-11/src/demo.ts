import {Pool} from "pg";
import SQL from "sql-template-strings";
import {UserRepo} from "./repositories/user.repo";

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/postgres",
});

async function ensureSchema() {
    await pool.query(
        SQL`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName"  TEXT NOT NULL,
      "age"       INTEGER NOT NULL CHECK ("age" >= 0),
      "gender"    TEXT NOT NULL CHECK ("gender" IN ('male','female','other'))
    );
  `
    );
}

async function runDemo() {
    await ensureSchema();

    const repo = new UserRepo(pool);

    const inserted = await repo.save({
        firstName: "John",
        lastName: "Doe",
        age: 30,
        gender: "male",
    });
    console.log("1) save ->", inserted);

    const list = await repo.find();
    console.log("2) find ->", list);

    const updated = await repo.update(inserted.id, { age: inserted.age + 1 });
    console.log("3) update ->", updated);

    await repo.delete(inserted.id);

    const afterDelete = await repo.findOne(inserted.id);
    console.log("4) findOne after delete ->", afterDelete);
}

runDemo()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });