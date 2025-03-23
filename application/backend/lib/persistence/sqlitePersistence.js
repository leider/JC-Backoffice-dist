import Database from "better-sqlite3";
import conf from "jc-shared/commons/simpleConfigure.js";
import { loggers } from "winston";
import { areDifferentForHistoryEntries } from "jc-shared/commons/comparingAndTransforming.js";
import map from "lodash/map.js";
import forEach from "lodash/forEach.js";
import isString from "lodash/isString.js";
export const db = new Database(conf.sqlitedb);
const scriptLogger = loggers.get("scripts");
scriptLogger.info(`DB = ${conf.sqlitedb}`);
function asSqliteString(obj) {
    return `${escape(JSON.stringify(obj))}`;
}
export function escape(str = "") {
    if (isString(str)) {
        return `'${str.replaceAll("'", "''")}'`;
    }
    return `'${str.toJSON().replaceAll("'", "''")}'`;
}
export function execWithTry(command) {
    try {
        db.exec(command);
    }
    catch (e) {
        const errortext = e.toString();
        if (!(errortext.startsWith("SqliteError: index") && errortext.endsWith("already exists"))) {
            // we expect re-entrance of index creation
            // eslint-disable-next-line no-console
            console.error(errortext);
        }
    }
}
process.on("SIGINT", () => {
    console.log("SHUTDOWN ON SIGINT (db)"); // eslint-disable-line no-console
    db.close();
});
class Persistence {
    initialize() {
        const columns = ["id TEXT PRIMARY KEY", "data BLOB"].concat(map(this.extraCols, (col) => `${col} TEXT`));
        db.exec(`CREATE TABLE IF NOT EXISTS ${this.collectionName} ( ${columns.join(",")});`);
        execWithTry(`CREATE INDEX idx_${this.collectionName}_id ON ${this.collectionName}(id);`);
        if (this.extraCols.length > 0) {
            const suffix = this.extraCols.join("_");
            const columns = this.extraCols.join(",");
            execWithTry(`CREATE INDEX idx_${this.collectionName}_${suffix} ON ${this.collectionName}(${columns});`);
            forEach(this.extraCols, (col) => {
                execWithTry(`CREATE INDEX idx_${this.collectionName}_${col} ON ${this.collectionName}(${col});`);
            });
        }
    }
    initializeHistory() {
        db.exec(`CREATE TABLE IF NOT EXISTS ${this.history} ( id TEXT, time TEXT, user TEXT, before BLOB, after BLOB, PRIMARY KEY(id, time) );`);
        execWithTry(`CREATE INDEX idx_${this.history}_id ON ${this.history}(id);`);
    }
    constructor(collection, extraCols = []) {
        this.extraCols = [];
        this.collectionName = collection;
        this.history = `${collection}history`;
        this.extraCols = extraCols;
        this.initialize();
        this.initializeHistory();
    }
    list(orderBy) {
        return this.listByField("true", orderBy);
    }
    listByField(where, orderBy = "id ASC") {
        const query = `SELECT data FROM ${this.collectionName} WHERE ${where} ORDER BY ${orderBy};`;
        return map(db.prepare(query).all(), (each) => each && JSON.parse(each.data));
    }
    getById(id) {
        return this.getByField({ key: "id", val: id });
    }
    getByField(where) {
        const query = `SELECT data FROM ${this.collectionName} WHERE ${where.key} = ${escape(where.val)};`;
        const result = db.prepare(query).get();
        return result ? JSON.parse(result.data) : {};
    }
    get colsForSave() {
        return ["id", "data"].concat(this.extraCols);
    }
    createValsForSave(object) {
        return [escape(object.id), asSqliteString(object)].concat(map(this.extraCols, (col) => {
            return escape(object[col]);
        }));
    }
    saveHistoryEntry(object, user) {
        const now = new Date().toJSON();
        const before = JSON.parse(JSON.stringify(this.getById(object.id)));
        const after = JSON.parse(JSON.stringify(object));
        if (!areDifferentForHistoryEntries(before, after)) {
            return; // no need to save unchanged objects
        }
        db.exec(`REPLACE INTO ${this.history} ( id, time, user, before, after ) VALUES ( ${escape(object.id)}, ${escape(now)}, ${escape(user.name)}, ${asSqliteString(before)}, ${asSqliteString(object)});`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save(object, user) {
        const vals = this.createValsForSave(object);
        const trans = db.transaction(() => {
            this.saveHistoryEntry(object, user);
            db.exec(`REPLACE INTO ${this.collectionName} (${this.colsForSave.join(",")}) VALUES (${vals.join(",")});`);
        });
        trans.immediate();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveAll(objects, user) {
        if (objects.length < 1) {
            return;
        }
        const rows = map(objects, (obj) => {
            const vals = this.createValsForSave(obj);
            return `(${vals.join(",")})`;
        });
        const trans = db.transaction(() => {
            forEach(objects, (obj) => this.saveHistoryEntry(obj, user));
            db.exec(`REPLACE INTO ${this.collectionName} (${this.colsForSave.join(",")}) VALUES ${rows.join("\n,")};`);
        });
        trans.immediate();
    }
    removeWithQuery(where) {
        return db.exec(`DELETE FROM ${this.collectionName} WHERE ${where};`);
    }
    removeById(id, user) {
        const trans = db.transaction(() => {
            this.saveHistoryEntry({ id }, user);
            this.removeWithQuery(`id = ${escape(id)}`);
        });
        trans.immediate();
    }
    removeAllByIds(ids, user) {
        const trans = db.transaction(() => {
            forEach(ids, (id) => this.saveHistoryEntry({ id }, user));
            this.removeWithQuery(`id IN (${map(ids, escape).join(",")})`);
        });
        trans.immediate();
    }
}
export default function (collectionName, extraCols) {
    return new Persistence(collectionName, extraCols);
}
