import { colorDefault } from "../optionen/optionValues.js";
import keys from "lodash/keys.js";
export default class Kopf {
    constructor(object) {
        this.beschreibung = "";
        this.eventTyp = "";
        this.flaeche = 100;
        this.kooperation = "";
        this.ort = "Jazzclub";
        this.titel = "";
        this.pressename = "Jazzclub Karlsruhe";
        this.presseIn = "im Jazzclub Karlsruhe";
        this.genre = "";
        this.confirmed = false;
        this.rechnungAnKooperation = false;
        this.abgesagt = false;
        this.fotografBestellen = false;
        this.kannAufHomePage = false;
        this.kannInSocialMedia = false;
        if (object && keys(object).length) {
            Object.assign(this, object);
        }
    }
    get isKooperation() {
        return !!this.kooperation && this.kooperation !== "_";
    }
    get rechnungAnKooperationspartner() {
        return !this.rechnungAnKooperation ? this.isKooperation : this.rechnungAnKooperation;
    }
    get presseInEcht() {
        return this.presseIn || this.pressename || this.ort;
    }
    get titelMitPrefix() {
        return `${this.abgesagt ? "Abgesagt: " : ""}${this.titel}`;
    }
    get kooperationspartnerText() {
        return this.isKooperation ? this.kooperation : "";
    }
    get color() {
        return this.eventTypRich?.color ?? colorDefault;
    }
}
