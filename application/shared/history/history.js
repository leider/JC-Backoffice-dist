import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import { differenceForAsObject } from "../commons/comparingAndTransforming.js";
import keys from "lodash/keys.js";
import map from "lodash/map.js";
import forEach from "lodash/forEach.js";
class HistoryRow {
    constructor(props) {
        this.header = "";
        this.geändert = undefined;
        this.gelöscht = undefined;
        this.hinzugefügt = undefined;
        Object.assign(this, props);
    }
    get asList() {
        const row = ["hinzugefügt", "geändert", "gelöscht"];
        const res = [];
        forEach(row, (typ) => {
            if (this[typ]) {
                res.push({ typ, val: this[typ] });
            }
        });
        return res;
    }
}
export function historyFromRawRows(rows) {
    return {
        rows: map(rows, (row) => {
            const result = {
                before: {},
                after: {},
                user: "",
                time: "",
            };
            Object.assign(result, row, {
                before: JSON.parse(row.before),
                after: JSON.parse(row.after),
                time: DatumUhrzeit.forISOString(row.time).toLocalDateTimeString,
            });
            delete result.before.changelist;
            delete result.after.changelist;
            const header = result.user + " " + result.time;
            if (!result.before.id && result.after.id) {
                return new HistoryRow({ header: `NEUANLAGE - ${header}`, ...differenceForAsObject(result.before, result.after) });
            }
            else if (result.before.id && keys(result.after).length === 1) {
                return new HistoryRow({ header: `GELÖSCHT - ${header}` });
            }
            else {
                return new HistoryRow({ header, ...differenceForAsObject(result.before, result.after) });
            }
        }),
    };
}
