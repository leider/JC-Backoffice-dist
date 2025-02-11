import misc from "../commons/misc.js";
import keys from "lodash/keys.js";
export default class Technik {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any*/
    toJSON() {
        return Object.assign({}, this);
    }
    constructor(object) {
        this.dateirider = [];
        this.backlineJazzclub = [];
        this.backlineRockshop = [];
        this.checked = false;
        this.fluegel = false;
        if (object && keys(object).length) {
            Object.assign(this, object, {
                dateirider: object.dateirider || [],
            });
        }
    }
    updateDateirider(datei) {
        const imagePushed = misc.pushImage(this.dateirider, datei);
        if (imagePushed) {
            this.dateirider = imagePushed;
            return true;
        }
        return false;
    }
    removeDateirider(datei) {
        this.dateirider = misc.dropImage(this.dateirider, datei);
    }
}
