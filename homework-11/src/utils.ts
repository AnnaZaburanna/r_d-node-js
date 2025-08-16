import {SQLStatement} from "sql-template-strings";

const IDENT = /^[a-z_][a-z0-9_]*$/i;

export function assertIdent(name: string, kind: "table" | "column") {
    if (!IDENT.test(name)) {
        throw new Error(`Invalid SQL ${kind} identifier: "${name}"`);
    }
}

export function appendIdent(stmt: SQLStatement, name: string) {
    assertIdent(name, "column");
    stmt.append(`"${name.replace(/"/g, '""')}"`);
}

export function appendTable(stmt: SQLStatement, table: string) {
    assertIdent(table, "table");
    stmt.append(`"${table.replace(/"/g, '""')}"`);
}