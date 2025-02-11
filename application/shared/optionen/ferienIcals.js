import Termin from "./termin.js";
import Misc from "../commons/misc.js";
import map from "lodash/map.js";
import invokeMap from "lodash/invokeMap.js";
export class Ical {
    constructor(object) {
        this.name = "";
        this.url = "";
        this.typ = "Sonstiges";
        if (object) {
            Object.assign(this, object);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return Object.assign({}, this);
    }
    get color() {
        return Termin.colorForType(this.typ);
    }
}
export class KalenderEvents {
    constructor(object) {
        this.id = "";
        this.content = "";
        this.updatedAt = new Date();
        if (object) {
            this.id = object.id ?? "";
            this.content = object.content ?? "";
            this.updatedAt = Misc.stringOrDateToDate(object.updatedAt);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return Object.assign({}, this);
    }
}
export default class FerienIcals {
    constructor(object) {
        this.id = "ferienIcals";
        this.icals = [];
        if (object && object.icals) {
            this.icals = map(object.icals, (each) => new Ical(each));
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return Object.assign({}, this, {
            icals: invokeMap(this.icals, "toJSON"),
        });
    }
}
