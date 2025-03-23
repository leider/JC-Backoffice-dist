import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import Misc from "../commons/misc.js";
import keys from "lodash/keys.js";
export default class Unterkunft {
    constructor(object, veranstaltungstagAsDatumUhrzeit, kuenstlerListe) {
        this.einzelNum = 0;
        this.doppelNum = 0;
        this.suiteNum = 0;
        this.einzelEUR = 0;
        this.doppelEUR = 0;
        this.suiteEUR = 0;
        this.transportEUR = 0;
        this.kommentar = "";
        this.sonstiges = [];
        this.angefragt = false;
        this.bestaetigt = false;
        if (object && keys(object).length !== 0) {
            delete object.transportText;
            delete object.name;
            Object.assign(this, object, {
                kommentar: object.kommentar ?? kuenstlerListe.join("\r\n"),
                sonstiges: Misc.toArray(object.sonstiges),
                einzelNum: object.einzelNum ?? 0,
                doppelNum: object.doppelNum ?? 0,
                suiteNum: object.suiteNum ?? 0,
                einzelEUR: object.einzelEUR ?? 0,
                doppelEUR: object.doppelEUR ?? 0,
                suiteEUR: object.suiteEUR ?? 0,
                transportEUR: object.transportEUR ?? 0,
            });
            this.anreiseDate = Misc.stringOrDateToDate(object.anreiseDate) ?? veranstaltungstagAsDatumUhrzeit.toJSDate;
            this.abreiseDate = Misc.stringOrDateToDate(object.abreiseDate) ?? veranstaltungstagAsDatumUhrzeit.plus({ tage: 1 }).toJSDate;
        }
        else {
            this.anreiseDate = veranstaltungstagAsDatumUhrzeit.toJSDate;
            this.abreiseDate = veranstaltungstagAsDatumUhrzeit.plus({ tage: 1 }).toJSDate;
        }
    }
    get checked() {
        return this.bestaetigt;
    }
    get anreiseDisplayDate() {
        const date = this.anreiseDate;
        return date ? DatumUhrzeit.forJSDate(date).tagMonatJahrKompakt : "";
    }
    get abreiseDisplayDate() {
        const date = this.abreiseDate;
        return date ? DatumUhrzeit.forJSDate(date).tagMonatJahrKompakt : "";
    }
    get anzahlNaechte() {
        const ab = this.abreiseDate;
        const an = this.anreiseDate;
        return ab && an ? DatumUhrzeit.forJSDate(ab).differenzInTagen(DatumUhrzeit.forJSDate(an)) : 0;
    }
    get anzahlZimmer() {
        function reallyNumber(val) {
            return parseInt(val.toString());
        }
        return reallyNumber(this.einzelNum) + reallyNumber(this.doppelNum) + reallyNumber(this.suiteNum);
    }
    get kostenTotalEUR() {
        return this.roomsTotalEUR + this.transportEUR;
    }
    get anzNacht() {
        const anz = this.anzahlNaechte;
        if (anz < 1) {
            return "";
        }
        return anz === 1 ? "eine Nacht" : `${anz} Nächte`;
    }
    get roomsTotalEUR() {
        const naechte = this.anzahlNaechte;
        return this.einzelNum * this.einzelEUR * naechte + this.doppelNum * this.doppelEUR * naechte + this.suiteNum * this.suiteEUR * naechte;
    }
    get zimmerPreise() {
        return { einzelEUR: this.einzelEUR, doppelEUR: this.doppelEUR, suiteEUR: this.suiteEUR };
    }
}
