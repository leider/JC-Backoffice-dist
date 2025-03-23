import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import Misc from "../commons/misc.js";
export default class Termin {
    constructor(object) {
        this.typ = "Sonstiges";
        this.startDate = new DatumUhrzeit().toJSDate;
        this.endDate = this.startDate;
        if (object) {
            this.beschreibung = object.beschreibung;
            this.typ = object.typ ?? "Sonstiges";
            this.startDate = Misc.stringOrDateToDate(object.startDate) || new DatumUhrzeit().toJSDate;
            this.endDate = Misc.stringOrDateToDate(object.endDate) || this.startDate;
        }
        else {
            this.startDate = new DatumUhrzeit().toJSDate;
            this.endDate = this.startDate;
        }
        this.id = object?.id ? object.id : encodeURIComponent(DatumUhrzeit.forJSDate(this.startDate).fuerCalendarWidget + this.beschreibung);
    }
    static colorForType(typ) {
        return {
            Sonstiges: "#d6bdff",
            Feiertag: "#c1c3ff",
            Ferien: "#c1c3ff",
            Vermietung: "#cc6678",
        }[typ];
    }
    startDatumUhrzeit() {
        return DatumUhrzeit.forJSDate(this.startDate);
    }
    endDatumUhrzeit() {
        return DatumUhrzeit.forJSDate(this.endDate);
    }
    get asEvent() {
        return {
            display: "block",
            borderColor: Termin.colorForType(this.typ),
            backgroundColor: Termin.colorForType(this.typ),
            textColor: "#fff",
            start: this.startDate.toISOString(),
            end: this.endDate.toISOString(),
            title: this.beschreibung || "",
            tooltip: this.beschreibung || "",
        };
    }
}
