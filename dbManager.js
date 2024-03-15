import { QuickDB, JSONDriver } from "quick.db";

const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

export async function setMode(id, mode) {
    await db.set(id, mode);
    return true;
}