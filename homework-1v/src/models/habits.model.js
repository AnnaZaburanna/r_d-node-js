import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB = join(__dirname, '..', 'database.json');

const read = async () => JSON.parse(await readFile(DB, 'utf8'));
const save = async (data) =>
    writeFile(DB, JSON.stringify(data, null, 2));

export async function getAll() {
    return read();
}

export async function getById(id) {
    return (await read()).find((u) => u.id === id);
}

export async function create(payload) {
    const db = await read();
    const user = { id: Date.now().toString(), ...payload, completedDates: [] };
    await save([...db, user]);
    return user;
}

export async function update(id, payload) {
    const db = await read();
    const idx = db.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db[idx] = { ...db[idx], ...payload };
    await save(db);
    return db[idx];
}

export async function remove(id) {
    const db = await read();
    const next = db.filter((u) => u.id !== id);
    if (next.length === db.length) return false;
    await save(next);
    return true;
}