import { db, escape } from "../persistence/sqlitePersistence.js";
import map from "lodash/map.js";
import groupBy from "lodash/groupBy.js";
import keys from "lodash/keys.js";
const mappedNames = {
    Mailregeln: "mailstorehistory",
    Optionen: "optionenstorehistory",
    Programmheft: "kalenderstorehistory",
    Rider: "riderstorehistory",
    User: "userstorehistory",
    Termine: "terminstorehistory",
    Veranstaltung: "veranstaltungenstorehistory",
    Vermietung: "vermietungenstorehistory",
};
function prunePasswords(dataString) {
    const pruned = JSON.parse(dataString);
    return JSON.stringify({
        ...pruned,
        hashedPassword: pruned.hashedPassword ? `${pruned.hashedPassword.substring(0, 3)}XXX` : undefined,
        salt: "YYY",
    });
}
export function loadHistoryRows({ collection, id }) {
    if (collection === "undefined" || id === "undefined") {
        return [];
    }
    const history = mappedNames[collection];
    const query = `SELECT * FROM ${history} WHERE id = ${escape(id)} ORDER BY time DESC;`;
    const result = db.prepare(query).all();
    return collection === "User"
        ? map(result, (record) => {
            record.before = prunePasswords(record.before);
            record.after = prunePasswords(record.after);
            return record;
        })
        : result;
}
export function loadLatestChangedObjectsOverview({ collection }) {
    if (collection === "undefined") {
        return [];
    }
    const history = mappedNames[collection];
    const query = `SELECT DISTINCT id, time, after FROM ${history} ORDER BY time DESC;`;
    const result = db.prepare(query).all();
    const idWithMore = groupBy(result, (elem) => elem.id);
    return map(keys(idWithMore), (key) => {
        const newestRow = idWithMore[key][0];
        const state = keys(JSON.parse(newestRow.after)).length === 1 ? "gelöscht" : "geändert";
        return { id: key, time: newestRow.time, state };
    });
}
