import misc from "../commons/misc.js";
import renderer from "../commons/renderer.js";
import keys from "lodash/keys.js";
export default class Vertrag {
    static get arten() {
        return ["Jazzclub", "Agentur/Künstler", "JazzClassix"];
    }
    static get sprachen() {
        return ["Deutsch", "Englisch", "Regional"];
    }
    constructor(object) {
        this.art = "Jazzclub";
        this.sprache = "Deutsch";
        this.datei = [];
        if (object && keys(object).length !== 0) {
            Object.assign(this, object, {
                datei: misc.toArray(object.datei),
            });
        }
    }
    get zusatzvereinbarungenHtml() {
        return renderer.render(this.zusatzvereinbarungen ?? "");
    }
    updateDatei(datei) {
        const imagePushed = misc.pushImage(this.datei, datei);
        if (imagePushed) {
            this.datei = imagePushed;
            return true;
        }
        return false;
    }
    removeDatei(datei) {
        this.datei = misc.dropImage(this.datei, datei);
    }
}
