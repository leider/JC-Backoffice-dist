import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import map from "lodash/map.js";
import capitalize from "lodash/capitalize.js";
export class Event {
    constructor({ start, farbe, emailOffset, was, users }) {
        this.users = [];
        this.start = DatumUhrzeit.forISOString(start).toISOString;
        this.farbe = farbe;
        this.emailOffset = emailOffset;
        this.was = was;
        this.users = users ?? [];
    }
    get names() {
        return map(this.users, capitalize).join(", ");
    }
    get title() {
        return `${(this.was ?? "").trim()} (${this.names.trim()})`;
    }
    cloneAndMoveBy(options) {
        const result = new Event(this);
        result.start = DatumUhrzeit.forISOString(result.start).plus(options).toISOString;
        return result;
    }
}
