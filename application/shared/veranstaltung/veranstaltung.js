import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import Misc from "../commons/misc.js";
import misc from "../commons/misc.js";
import Artist from "./artist.js";
import Kopf from "./kopf.js";
import Kosten from "./kosten.js";
import Presse from "./presse.js";
import Staff from "./staff.js";
import Technik from "./technik.js";
import dayjs from "dayjs";
import times from "lodash/times.js";
import map from "lodash/map.js";
export default class Veranstaltung {
    constructor(object) {
        this.ghost = undefined; // for displaying multidays
        this.startDate = new DatumUhrzeit().setUhrzeit(20, 0).toJSDate;
        this.endDate = DatumUhrzeit.forJSDate(this.startDate).plus({ stunden: 3 }).toJSDate;
        this.url = "";
        this.artist = new Artist(undefined);
        this.kopf = new Kopf();
        this.kosten = new Kosten();
        this.presse = new Presse();
        this.staff = new Staff();
        this.technik = new Technik();
        this.brauchtPresse = true;
        this.booker = [];
        if (object) {
            Object.assign(this, {
                id: object.id,
                ghost: object.ghost,
                brauchtPresse: object.brauchtPresse ?? true,
                startDate: Misc.stringOrDateToDate(object.startDate),
                endDate: Misc.stringOrDateToDate(object.endDate),
                url: object.url,
                artist: new Artist(object.artist),
                kopf: new Kopf(object.kopf),
                kosten: new Kosten(object.kosten),
                presse: new Presse(object.presse),
                staff: new Staff(object.staff),
                technik: new Technik(object.technik),
                booker: object.booker,
            });
        }
        else {
            this.startDate = new DatumUhrzeit().setUhrzeit(20, 0).toJSDate;
            this.endDate = new DatumUhrzeit().setUhrzeit(23, 0).toJSDate;
        }
    }
    get fullyQualifiedUrl() {
        return `${this.isVermietung ? "/vermietung/" : "/konzert/"}${encodeURIComponent(this.url || "")}`;
    }
    get fullyQualifiedPreviewUrl() {
        return `${this.isVermietung ? "/vermietung/" : "/konzert/"}preview/${encodeURIComponent(this.url || "")}`;
    }
    createGhostsForOverview() {
        const ghostResults = map(this.tageOhneStart, (ghostStart) => {
            return {
                id: `${this.id}ghost${ghostStart.toISOString}`,
                startDate: ghostStart.setUhrzeit(0, 0).toJSDate,
                kopf: this.kopf,
                url: this.url,
                ghost: true,
            };
        });
        return map(ghostResults, (each) => this.asNew(each));
    }
    colorFor(infix) {
        return `var(--jazz-${misc.normalizeString(this.kopf.eventTypRich?.name ?? "vermietung")}${infix}${this.ghost ? "-ghost)" : ")"}`;
    }
    get color() {
        return this.colorFor("-color");
    }
    get colorText() {
        return this.colorFor("-text-color");
    }
    get initializedUrl() {
        return DatumUhrzeit.forJSDate(this.startDate).fuerCalendarWidget + "-" + Misc.normalizeString(this.kopf.titel ?? this.id ?? "");
    }
    initializeIdAndUrl() {
        this.url = this.initializedUrl;
        this.id = this.kopf.titel + " am " + this.datumForDisplay;
    }
    get tageOhneStart() {
        const days = dayjs(this.endDate).diff(dayjs(this.startDate), "d");
        return times(days, (no) => new DatumUhrzeit(dayjs(this.startDate).add(no + 1, "d")));
    }
    // Dates and Times
    get startDatumUhrzeit() {
        return DatumUhrzeit.forJSDate(this.startDate);
    }
    get endDatumUhrzeit() {
        return DatumUhrzeit.forJSDate(this.endDate);
    }
    get datumForDisplayShort() {
        return this.startDatumUhrzeit.lesbareKurzform;
    }
    get datumForDisplay() {
        return this.startDatumUhrzeit.tagMonatJahrLang;
    }
    // used in pug file !
    get istVergangen() {
        return this.startDatumUhrzeit.istVor(new DatumUhrzeit());
    }
    isDisplayedAbove(other, reverse = false) {
        if (!other) {
            return false;
        }
        const result = this.startDatumUhrzeit.istVor(other?.startDatumUhrzeit);
        return reverse ? !result : result;
    }
    // eslint-disable-next-line lodash/prefer-constant
    get tooltipInfos() {
        return "";
    }
    asCalendarEvent(isOrgaTeam) {
        return {
            start: this.startDate.toISOString(),
            end: this.endDate.toISOString(),
            title: this.kopf.titelMitPrefix,
            tooltip: this.tooltipInfos,
            linkTo: isOrgaTeam ? this.fullyQualifiedUrl : this.fullyQualifiedPreviewUrl,
            backgroundColor: this.color,
            textColor: this.colorText,
            borderColor: !this.kopf.confirmed ? "#f8500d" : this.color,
        };
    }
    reset() {
        this.id = undefined;
        this.url = undefined;
        this.startDate = new DatumUhrzeit().setUhrzeit(20, 0).toJSDate;
        this.endDate = DatumUhrzeit.forJSDate(this.startDate).plus({ stunden: 3 }).toJSDate;
        this.artist.getInForMasterDate = undefined;
        this.artist.bandTransport = undefined;
        this.staff = new Staff();
        this.kopf.confirmed = false;
        this.kopf.fotografBestellen = false;
        this.kopf.kannAufHomePage = false;
        this.kopf.kannInSocialMedia = false;
    }
}
