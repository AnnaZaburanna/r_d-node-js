import {Pool, QueryResult} from "pg";
import SQL from "sql-template-strings";
import {appendIdent, appendTable} from "../utils";

export class Orm<T extends {id: string | number}> {

    constructor(private table: string, private pool: Pool) {}

    async find(filters?: Partial<T>): Promise<T[]> {
        let q = SQL`SELECT * FROM `;
        appendTable(q, this.table);

        const entries = Object.entries(filters ?? {}).filter(
            ([, v]) => v !== undefined
        );

        if (entries.length > 0) {
            q = q.append(SQL` WHERE `);
            entries.forEach(([key, value], idx) => {
                if (idx > 0) q.append(SQL` AND `);
                appendIdent(q, key);
                q = q.append(SQL` = ${value}`);
            });
        }

        q = q.append(SQL` ORDER BY `);
        appendIdent(q, "id");

        const res: QueryResult = await this.pool.query(q);
        return res.rows as T[];
    }

    async findOne(id: T["id"]): Promise<T | null> {
        let q = SQL`SELECT * FROM `;
        appendTable(q, this.table);
        q = q.append(SQL` WHERE `);
        appendIdent(q, "id");
        q = q.append(SQL` = ${id} LIMIT 1`);

        const res = await this.pool.query(q);
        return (res.rows[0] as T) ?? null;
    }

    async save(entity: Omit<T, "id">): Promise<T> {
        const keys = Object.keys(entity) as Array<keyof Omit<T, "id">>;
        if (keys.length === 0) throw new Error("Nothing to insert");

        let q = SQL`INSERT INTO `;
        appendTable(q, this.table);
        q = q.append(SQL` (`);
        keys.forEach((k, i) => {
            if (i > 0) q.append(SQL`, `);
            appendIdent(q, String(k));
        });
        q = q.append(SQL`) VALUES (`);
        keys.forEach((k, i) => {
            if (i > 0) q.append(SQL`, `);
            q = q.append(SQL`${(entity as any)[k]}`);
        });
        q = q.append(SQL`) RETURNING *`);

        const res = await this.pool.query(q);
        return res.rows[0] as T;
    }

    async update(id: T["id"], patch: Partial<T>): Promise<T> {
        const entries = Object.entries(patch).filter(
            ([k, v]) => k !== "id" && v !== undefined
        );

        if (entries.length === 0) throw new Error("Nothing to update");

        let q = SQL`UPDATE `;
        appendTable(q, this.table);
        q = q.append(SQL` SET `);

        entries.forEach(([key, value], idx) => {
            if (idx > 0) q.append(SQL`, `);
            appendIdent(q, key);
            q = q.append(SQL` = ${value}`);
        });

        q = q.append(SQL` WHERE `);
        appendIdent(q, "id");
        q = q.append(SQL` = ${id} RETURNING *`);

        const res = await this.pool.query(q);
        return res.rows[0] as T;
    }

    async delete(id: T["id"]): Promise<void> {
        let q = SQL`DELETE FROM `;
        appendTable(q, this.table);
        q = q.append(SQL` WHERE `);
        appendIdent(q, "id");
        q = q.append(SQL` = ${id}`);

        await this.pool.query(q);
    }
}