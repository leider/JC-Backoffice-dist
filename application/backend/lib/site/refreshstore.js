import { db, execWithTry } from "../persistence/sqlitePersistence.js";
import map from "lodash/map.js";
import forEach from "lodash/forEach.js";
const STORE = "refreshtokens";
function smoothMigrate() {
    try {
        const result = map(db.prepare("SELECT * FROM refreshstore").all(), (each) => JSON.parse(each.data));
        const trans = db.transaction((rows) => {
            forEach(rows, (row) => {
                const query = `REPLACE INTO ${STORE} (id,expiresAt,userId) VALUES ('${row.id}', '${row.expiresAt}', '${row.userId}')`;
                db.exec(query);
            });
            db.exec("DROP TABLE refreshstore");
        });
        trans.immediate(result);
    }
    catch {
        // nothing to see here, table already history
    }
}
class LocalPersistence {
    constructor() {
        const columns = ["id TEXT PRIMARY KEY", "expiresAt TEXT", "userId TEXT"];
        db.exec(`CREATE TABLE IF NOT EXISTS ${STORE} ( ${columns.join(",")});`);
        execWithTry(`CREATE INDEX idx_${STORE}_id ON ${STORE}(id);`);
        smoothMigrate();
    }
    save(object) {
        const { id, expiresAt, userId } = object;
        db.exec(`REPLACE INTO ${STORE} (id,expiresAt,userId) VALUES ('${id}', '${expiresAt.toJSON()}', '${userId}')`);
    }
    getById(id) {
        const query = `SELECT * FROM ${STORE} WHERE id = '${id}';`;
        return db.prepare(query).get();
    }
    removeOldTokens() {
        return db.exec(`DELETE FROM ${STORE} WHERE expiresAt < '${new Date().toJSON()}';`);
    }
}
const persistence = new LocalPersistence();
export default {
    save: function save(refreshToken) {
        persistence.save(refreshToken);
        return refreshToken;
    },
    forId: function forId(id) {
        return persistence.getById(id);
    },
    removeExpired: function removeExpired() {
        return persistence.removeOldTokens();
    },
};
