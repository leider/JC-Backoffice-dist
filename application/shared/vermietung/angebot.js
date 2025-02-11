import renderer from "../commons/renderer.js";
import Misc from "../commons/misc.js";
import keys from "lodash/keys.js";
export default class Angebot {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return Object.assign({}, this);
    }
    constructor(object) {
        this.saalmiete = 0;
        this.saalmieteRabatt = 0;
        this.tontechnikerAnzahl = 1;
        this.tontechnikerBetrag = 0;
        this.lichttechnikerAnzahl = 1;
        this.lichttechnikerBetrag = 0;
        this.musikerAnzahl = 1;
        this.musikerGage = 0;
        this.reinigungHaus = 0;
        this.barpersonalAnzahl = 1;
        this.barpersonalBetrag = 0;
        this.reinigungBar = 0;
        this.abenddienst = 0;
        this.fluegel = 0;
        this.status = "offen";
        this.frei1 = "";
        this.frei1EUR = 0;
        this.frei2 = "";
        this.frei2EUR = 0;
        this.frei3 = "";
        this.frei3EUR = 0;
        this.beschreibung = "";
        this.freigabe = "";
        if (object && keys(object).length) {
            Object.assign(this, object, {
                freigabeAm: Misc.stringOrDateToDate(object.freigabeAm),
            });
        }
    }
    get saalmieteTotal() {
        return this.saalmiete + this.saalmieteRabattEUR;
    }
    get saalmieteRabattEUR() {
        return -((this.saalmiete * this.saalmieteRabatt) / 100);
    }
    get tontechnikerTotal() {
        return this.tontechnikerAnzahl * this.tontechnikerBetrag;
    }
    get lichttechnikerTotal() {
        return this.lichttechnikerAnzahl * this.lichttechnikerBetrag;
    }
    get musikerTotal() {
        return this.musikerAnzahl * this.musikerGage;
    }
    get barpersonalTotal() {
        return this.barpersonalAnzahl * this.barpersonalBetrag;
    }
    get renderedBeschreibung() {
        return renderer.render(this.beschreibung || "");
    }
    get summe() {
        return (this.saalmieteTotal +
            this.tontechnikerTotal +
            this.lichttechnikerTotal +
            this.musikerTotal +
            this.barpersonalTotal +
            this.reinigungHaus +
            this.reinigungBar +
            this.fluegel +
            this.frei1EUR +
            this.frei2EUR +
            this.frei3EUR +
            this.abenddienst);
    }
}
