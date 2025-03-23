import isNil from "lodash/isNil.js";
import keys from "lodash/keys.js";
const standardRabattErmaessigt = 2;
const standardRabattMitglied = 5;
export default class Eintrittspreise {
    static preisprofilAlt(object) {
        if (object.frei) {
            return { name: "Freier Eintritt", regulaer: 0, rabattErmaessigt: 0, rabattMitglied: 0 };
        }
        return {
            name: "Individuell (Alt)",
            regulaer: object.regulaer || 0,
            rabattErmaessigt: object.rabattErmaessigt || 0,
            rabattMitglied: object.rabattMitglied || 0,
        };
    }
    constructor(object) {
        this.preisprofil = { name: "Freier Eintritt", regulaer: 0, rabattErmaessigt: 0, rabattMitglied: 0 };
        this.erwarteteBesucher = 0;
        this.zuschuss = 0;
        if (object && keys(object).length !== 0) {
            if (!object.preisprofil) {
                this.preisprofil = Eintrittspreise.preisprofilAlt(object);
            }
            else {
                this.preisprofil = Object.assign({}, object.preisprofil);
            }
            this.erwarteteBesucher = object.erwarteteBesucher || 0;
            this.zuschuss = object.zuschuss || 0;
        }
    }
    get frei() {
        return this.preisprofil.regulaer === 0;
    }
    get istKooperation() {
        return this.preisprofil.name === "Kooperation";
    }
    get regulaer() {
        return this.preisprofil.regulaer;
    }
    get rabattErmaessigt() {
        return isNil(this.preisprofil.rabattErmaessigt) ? standardRabattErmaessigt : this.preisprofil.rabattErmaessigt;
    }
    get rabattMitglied() {
        return isNil(this.preisprofil.rabattMitglied) ? standardRabattMitglied : this.preisprofil.rabattMitglied;
    }
    get ermaessigt() {
        return Math.max(this.regulaer - Math.abs(this.rabattErmaessigt), 0);
    }
    get mitglied() {
        return Math.max(this.regulaer - Math.abs(this.rabattMitglied), 0);
    }
    get eintrittspreisSchnitt() {
        return 0.8 * this.regulaer + 0.1 * this.ermaessigt + 0.1 * this.mitglied;
    }
    get erwarteterEintritt() {
        return this.erwarteteBesucher * (this.frei ? 10 : this.eintrittspreisSchnitt);
    }
}
