import Termin from "./termin.js";
import Misc from "../commons/misc.js";
import map from "lodash/map.js";
export class Ical {
    constructor(object) {
        this.name = "";
        this.url = "";
        this.typ = "Sonstiges";
        if (object) {
            Object.assign(this, object);
        }
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
}
export default class FerienIcals {
    constructor(object) {
        this.id = "ferienIcals";
        this.icals = [];
        if (object && object.icals) {
            this.icals = map(object.icals, (each) => new Ical(each));
        }
    }
}
