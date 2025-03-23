import Kopf from "../veranstaltung/kopf.js";
import Angebot from "./angebot.js";
import Kontakt from "../veranstaltung/kontakt.js";
import Veranstaltung from "../veranstaltung/veranstaltung.js";
export default class Vermietung extends Veranstaltung {
    constructor(object) {
        super(object ?? { brauchtPresse: false });
        this.saalmiete = undefined;
        this.brauchtTechnik = false;
        this.brauchtBar = false;
        this.art = "Angebot";
        this.angebot = new Angebot();
        this.vertragspartner = new Kontakt();
        if (object) {
            Object.assign(this, {
                angebot: new Angebot(object.angebot),
                kopf: new Kopf(object.kopf),
                vertragspartner: new Kontakt(object.vertragspartner),
                saalmiete: object.saalmiete,
                brauchtTechnik: object.brauchtTechnik,
                brauchtBar: object.brauchtBar,
                art: object.art,
            });
        }
    }
    asNew(object) {
        return new Vermietung(object);
    }
    // eslint-disable-next-line lodash/prefer-constant
    get isVermietung() {
        return true;
    }
    reset() {
        super.reset();
    }
    get brauchtPersonal() {
        return !this.staff.noStaffNeeded;
    }
}
