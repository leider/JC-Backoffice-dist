import misc from "../commons/misc.js";
import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import { Event } from "./Event.js";
import map from "lodash/map.js";
import invokeMap from "lodash/invokeMap.js";
export default class Kalender {
    constructor(object) {
        this.events = [];
        this.migrated = false;
        if (object && object.id && object.id.split("/").length === 2) {
            const splits = object.id.split("/");
            if (misc.isNumber(splits[0]) && misc.isNumber(splits[1])) {
                this.id = object.id;
                this.events = map(object.events, (each) => new Event(each));
                this.migrated = object.migrated === true;
                return;
            }
        }
        this.id = "2018/01";
    }
    year() {
        return this.id && this.id.split("/")[0];
    }
    eventsMovedWithBase(otherKalId) {
        const thisDatum = DatumUhrzeit.forYYYYslashMM(this.id);
        const otherDatum = DatumUhrzeit.forYYYYslashMM(otherKalId);
        const differenz = otherDatum.differenzInMonaten(thisDatum);
        const result = invokeMap(this.events, "cloneAndMoveBy", { monate: differenz });
        result.sort((a, b) => a.start.localeCompare(b.start));
        return result;
    }
    sortEvents() {
        this.events.sort((a, b) => a.start?.localeCompare(b.start));
    }
}
