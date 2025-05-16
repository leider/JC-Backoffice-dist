import DatumUhrzeit from "../commons/DatumUhrzeit.js";
import Misc from "../commons/misc.js";
import isString from "lodash/isString.js";
import keys from "lodash/keys.js";
export default class Kasse {
    constructor(object) {
        this.anfangsbestandEUR = 0;
        this.ausgabeBankEUR = 0;
        this.ausgabeCateringEUR = 0;
        this.ausgabeHelferEUR = 0;
        this.ausgabeSonstiges1EUR = 0;
        this.ausgabeSonstiges2EUR = 0;
        this.ausgabeSonstiges3EUR = 0;
        this.einnahmeBankEUR = 0;
        this.einnahmeSonstiges1EUR = 0;
        this.einnahmeTicketsEUR = 0;
        this.einnahmeSonstiges2EUR = 0;
        this.ausgabeSonstiges1Text = "";
        this.ausgabeSonstiges2Text = "";
        this.ausgabeSonstiges3Text = "";
        this.einnahmeSonstiges1Text = "";
        this.einnahmeSonstiges2Text = "";
        this.anzahlBesucherAK = 0;
        this.kassenfreigabe = "";
        this.einnahmenReservix = 0; // darf nicht in kassenberechnung
        this.anzahlReservix = 0; // darf nicht in kassenberechnung
        this.startinhalt = {
            "10": undefined,
            "20": undefined,
            "50": undefined,
            "100": undefined,
            "200": undefined,
            "500": undefined,
            "1000": undefined,
            "2000": undefined,
            "5000": undefined,
            "10000": undefined,
        };
        this.endinhalt = {
            "10": undefined,
            "20": undefined,
            "50": undefined,
            "100": undefined,
            "200": undefined,
            "500": undefined,
            "1000": undefined,
            "2000": undefined,
            "5000": undefined,
            "10000": undefined,
        };
        this.endbestandGezaehltEUR = 0;
        if (object && keys(object).length !== 0) {
            const ak = object.anzahlBesucherAK ?? 0;
            Object.assign(this, object, {
                kassenfreigabeAm: Misc.stringOrDateToDate(object.kassenfreigabeAm),
                anzahlBesucherAK: isString(ak) ? parseInt(ak) : ak,
                startinhalt: {
                    "10": object.startinhalt?.["10"],
                    "20": object.startinhalt?.["20"],
                    "50": object.startinhalt?.["50"],
                    "100": object.startinhalt?.["100"],
                    "200": object.startinhalt?.["200"],
                    "500": object.startinhalt?.["500"],
                    "1000": object.startinhalt?.["1000"],
                    "2000": object.startinhalt?.["2000"],
                    "5000": object.startinhalt?.["5000"],
                    "10000": object.startinhalt?.["10000"],
                },
                endinhalt: {
                    "10": object.endinhalt?.["10"],
                    "20": object.endinhalt?.["20"],
                    "50": object.endinhalt?.["50"],
                    "100": object.endinhalt?.["100"],
                    "200": object.endinhalt?.["200"],
                    "500": object.endinhalt?.["500"],
                    "1000": object.endinhalt?.["1000"],
                    "2000": object.endinhalt?.["2000"],
                    "5000": object.endinhalt?.["5000"],
                    "10000": object.endinhalt?.["10000"],
                },
            });
        }
    }
    get ausgabenOhneGage() {
        return (this.ausgabeCateringEUR + this.ausgabeHelferEUR + this.ausgabeSonstiges1EUR + this.ausgabeSonstiges2EUR + this.ausgabeSonstiges3EUR);
    }
    get ausgabenTotalEUR() {
        return this.ausgabeBankEUR + this.ausgabenOhneGage;
    }
    get einnahmeOhneBankUndTickets() {
        return this.einnahmeSonstiges1EUR + this.einnahmeSonstiges2EUR;
    }
    get einnahmeTotalEUR() {
        return this.einnahmeBankEUR + this.einnahmeOhneBankUndTickets + this.einnahmeTicketsEUR;
    }
    get endbestandEUR() {
        return this.anfangsbestandEUR + this.einnahmeTotalEUR - this.ausgabenTotalEUR;
    }
    // FREIGABE
    get istFreigegeben() {
        return !!this.kassenfreigabe;
    }
    get freigabeDisplayDatum() {
        return this.kassenfreigabeAm ? DatumUhrzeit.forJSDate(this.kassenfreigabeAm).tagMonatJahrLang : "";
    }
}
