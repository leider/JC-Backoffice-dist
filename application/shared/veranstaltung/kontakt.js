import keys from "lodash/keys.js";
export default class Kontakt {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any*/
    toJSON() {
        return Object.assign({}, this);
    }
    constructor(object) {
        this.adresse = "";
        this.ansprechpartner = "";
        this.email = "";
        this.name = "";
        this.telefon = "";
        if (object && keys(object).length) {
            Object.assign(this, object);
        }
    }
    line(number, alternative = "-") {
        return this.addressLines[number] || alternative;
    }
    get strasse() {
        return this.line(0);
    }
    get ort() {
        return this.line(1);
    }
    get addressLines() {
        if (this.adresse) {
            const lines = this.adresse.match(/[^\r\n]+/g);
            return lines ?? [];
        }
        return [];
    }
    get einzeiligeAdresse() {
        if (this.adresse) {
            const lines = this.adresse.match(/[^\r\n]+/g);
            return lines?.join(", ") || "";
        }
        return "-";
    }
}
